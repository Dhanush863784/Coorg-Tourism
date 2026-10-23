package com.coorgtourism.service;

import com.coorgtourism.dto.ReviewRequestDTO;
import com.coorgtourism.dto.ReviewResponseDTO;
import com.coorgtourism.entity.*;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final HomestayRepository homestayRepository;
    private final CabRepository cabRepository;
    private final TouristPlaceRepository touristPlaceRepository;
    private final BookingRepository bookingRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         UserRepository userRepository,
                         RestaurantRepository restaurantRepository,
                         HomestayRepository homestayRepository,
                         CabRepository cabRepository,
                         TouristPlaceRepository touristPlaceRepository,
                         BookingRepository bookingRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.homestayRepository = homestayRepository;
        this.cabRepository = cabRepository;
        this.touristPlaceRepository = touristPlaceRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO requestDTO, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerEmail));

        // 1. Verify service exists
        verifyServiceExists(requestDTO.getReviewType(), requestDTO.getServiceId());

        // 2. Prevent duplicate reviews
        Optional<Review> existingReview = reviewRepository.findByCustomerIdAndReviewTypeAndServiceId(
                customer.getId(), requestDTO.getReviewType(), requestDTO.getServiceId()
        );
        if (existingReview.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reviewed this service.");
        }

        // 3. Optional booking verification (Customer must have booked it)
        verifyCustomerBookedService(customer.getId(), requestDTO.getReviewType(), requestDTO.getServiceId());

        Review review = Review.builder()
                .customer(customer)
                .reviewType(requestDTO.getReviewType())
                .serviceId(requestDTO.getServiceId())
                .rating(requestDTO.getRating())
                .comment(requestDTO.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);
        
        // 4. Update the service's average rating
        updateServiceAverageRating(requestDTO.getReviewType(), requestDTO.getServiceId());

        return mapToResponse(savedReview);
    }

    public List<ReviewResponseDTO> getReviewsForService(ReviewType reviewType, Long serviceId) {
        verifyServiceExists(reviewType, serviceId);
        return reviewRepository.findByReviewTypeAndServiceIdOrderByCreatedAtDesc(reviewType, serviceId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ReviewResponseDTO getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        return mapToResponse(review);
    }

    public List<ReviewResponseDTO> getMyReviews(String customerEmail) {
        return reviewRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponseDTO updateReview(Long id, ReviewRequestDTO requestDTO, String callerEmail, Role callerRole) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (callerRole != Role.ADMIN && !review.getCustomer().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only edit your own reviews");
        }

        review.setRating(requestDTO.getRating());
        review.setComment(requestDTO.getComment());

        Review updatedReview = reviewRepository.save(review);
        updateServiceAverageRating(review.getReviewType(), review.getServiceId());

        return mapToResponse(updatedReview);
    }

    @Transactional
    public void deleteReview(Long id, String callerEmail, Role callerRole) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (callerRole != Role.ADMIN && !review.getCustomer().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
        updateServiceAverageRating(review.getReviewType(), review.getServiceId());
    }

    public Map<String, Object> getReviewSummary(ReviewType reviewType, Long serviceId) {
        verifyServiceExists(reviewType, serviceId);
        Double avg = reviewRepository.calculateAverageRating(reviewType, serviceId);
        Long count = reviewRepository.countReviewsByService(reviewType, serviceId);

        BigDecimal averageRating = avg != null ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        Map<String, Object> summary = new HashMap<>();
        summary.put("serviceId", serviceId);
        summary.put("reviewType", reviewType);
        summary.put("averageRating", averageRating);
        summary.put("totalReviews", count);
        return summary;
    }

    private void verifyServiceExists(ReviewType type, Long serviceId) {
        boolean exists = switch (type) {
            case RESTAURANT -> restaurantRepository.existsById(serviceId);
            case HOMESTAY -> homestayRepository.existsById(serviceId);
            case CAB -> cabRepository.existsById(serviceId);
            case TOURIST_PLACE -> touristPlaceRepository.existsById(serviceId);
        };
        if (!exists) {
            throw new ResourceNotFoundException("Service not found for type: " + type + " and ID: " + serviceId);
        }
    }

    private void verifyCustomerBookedService(Long customerId, ReviewType type, Long serviceId) {
        // Find if any CONFIRMED or COMPLETED booking exists
        BookingType bookingType = BookingType.valueOf(type.name());
        boolean hasBooking = bookingRepository.findAll().stream()
                .anyMatch(b -> b.getCustomer().getId().equals(customerId)
                        && b.getBookingType() == bookingType
                        && b.getServiceId().equals(serviceId)
                        && (b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.COMPLETED));
        
        if (!hasBooking) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only review services you have booked.");
        }
    }

    private void updateServiceAverageRating(ReviewType type, Long serviceId) {
        Double avg = reviewRepository.calculateAverageRating(type, serviceId);
        BigDecimal averageRating = avg != null ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP) : null;

        switch (type) {
            case RESTAURANT -> {
                Restaurant r = restaurantRepository.findById(serviceId).orElse(null);
                if (r != null) { r.setRating(averageRating); restaurantRepository.save(r); }
            }
            case HOMESTAY -> {
                Homestay h = homestayRepository.findById(serviceId).orElse(null);
                if (h != null) { h.setRating(averageRating); homestayRepository.save(h); }
            }
            case CAB -> {
                Cab c = cabRepository.findById(serviceId).orElse(null);
                if (c != null) { c.setRating(averageRating); cabRepository.save(c); }
            }
            case TOURIST_PLACE -> {
                TouristPlace tp = touristPlaceRepository.findById(serviceId).orElse(null);
                if (tp != null) { tp.setRating(averageRating); touristPlaceRepository.save(tp); }
            }
        }
    }

    private ReviewResponseDTO mapToResponse(Review review) {
        return ReviewResponseDTO.builder()
                .id(review.getId())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName())
                .reviewType(review.getReviewType())
                .serviceId(review.getServiceId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
