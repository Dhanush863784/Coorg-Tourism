package com.coorgtourism.service;

import com.coorgtourism.dto.*;
import com.coorgtourism.entity.*;
import com.coorgtourism.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class CustomerService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final TripRepository tripRepository;
    private final ReviewRepository reviewRepository;

    public CustomerService(UserRepository userRepository,
                           BookingRepository bookingRepository,
                           PaymentRepository paymentRepository,
                           TripRepository tripRepository,
                           ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.tripRepository = tripRepository;
        this.reviewRepository = reviewRepository;
    }

    public CustomerDashboardDTO getDashboardSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Booking> bookings = bookingRepository.findByCustomerEmailOrderByCreatedAtDesc(email);
        List<Payment> payments = paymentRepository.findByBookingCustomerEmailOrderByCreatedAtDesc(email);
        List<Trip> trips = tripRepository.findByCustomerEmailOrderByCreatedAtDesc(email);
        List<Review> reviews = reviewRepository.findByCustomerEmailOrderByCreatedAtDesc(email);

        long pending = bookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long confirmed = bookings.stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
        long cancelled = bookings.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();
        long completed = bookings.stream().filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();

        LocalDate now = LocalDate.now();
        long upcomingTrips = trips.stream().filter(t -> t.getStartDate() != null && (t.getStartDate().isAfter(now) || t.getStartDate().isEqual(now))).count();

        List<Payment> successfulPayments = payments.stream().filter(p -> p.getStatus() == PaymentStatus.SUCCESS).toList();
        BigDecimal totalPaid = successfulPayments.stream().map(Payment::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        UserResponseDTO profile = UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();

        return CustomerDashboardDTO.builder()
                .profile(profile)
                .totalBookings(bookings.size())
                .pendingBookings(pending)
                .confirmedBookings(confirmed)
                .cancelledBookings(cancelled)
                .completedBookings(completed)
                .upcomingTrips(upcomingTrips)
                .totalSuccessfulPayments(successfulPayments.size())
                .totalAmountPaid(totalPaid)
                .totalReviewsWritten(reviews.size())
                .build();
    }

    public UserResponseDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }

    @Transactional
    public UserResponseDTO updateProfile(String email, CustomerProfileUpdateDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user = userRepository.save(user);
        
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
