package com.coorgtourism.service;

import com.coorgtourism.dto.BookingResponseDTO;
import com.coorgtourism.dto.OwnerDashboardDTO;
import com.coorgtourism.dto.OwnerEarningsDTO;
import com.coorgtourism.dto.UserResponseDTO;
import com.coorgtourism.entity.*;
import com.coorgtourism.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OwnerService {

    private final RestaurantRepository restaurantRepository;
    private final HomestayRepository homestayRepository;
    private final CabRepository cabRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public OwnerService(RestaurantRepository restaurantRepository,
                        HomestayRepository homestayRepository,
                        CabRepository cabRepository,
                        BookingRepository bookingRepository,
                        PaymentRepository paymentRepository,
                        UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.homestayRepository = homestayRepository;
        this.cabRepository = cabRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    private List<Booking> getOwnerBookings(String ownerEmail) {
        List<Long> restaurantIds = restaurantRepository.findByOwnerEmail(ownerEmail)
                .stream().map(Restaurant::getId).collect(Collectors.toList());
        List<Long> homestayIds = homestayRepository.findByOwnerEmail(ownerEmail)
                .stream().map(Homestay::getId).collect(Collectors.toList());
        List<Long> cabIds = cabRepository.findByOwnerEmail(ownerEmail)
                .stream().map(Cab::getId).collect(Collectors.toList());

        List<Booking> bookings = new ArrayList<>();
        if (!restaurantIds.isEmpty()) {
            bookings.addAll(bookingRepository.findByServiceIdInAndBookingType(restaurantIds, BookingType.RESTAURANT));
        }
        if (!homestayIds.isEmpty()) {
            bookings.addAll(bookingRepository.findByServiceIdInAndBookingType(homestayIds, BookingType.HOMESTAY));
        }
        if (!cabIds.isEmpty()) {
            bookings.addAll(bookingRepository.findByServiceIdInAndBookingType(cabIds, BookingType.CAB));
        }
        return bookings;
    }

    public OwnerDashboardDTO getDashboardSummary(String ownerEmail) {
        List<Restaurant> restaurants = restaurantRepository.findByOwnerEmail(ownerEmail);
        List<Homestay> homestays = homestayRepository.findByOwnerEmail(ownerEmail);
        List<Cab> cabs = cabRepository.findByOwnerEmail(ownerEmail);

        long resCount = restaurants.size();
        long homeCount = homestays.size();
        long cabCount = cabs.size();

        BigDecimal totalRating = BigDecimal.ZERO;
        int ratedCount = 0;

        for (Restaurant r : restaurants) {
            if (r.getRating() != null) {
                totalRating = totalRating.add(r.getRating());
                ratedCount++;
            }
        }
        for (Homestay h : homestays) {
            if (h.getRating() != null) {
                totalRating = totalRating.add(h.getRating());
                ratedCount++;
            }
        }
        for (Cab c : cabs) {
            if (c.getRating() != null) {
                totalRating = totalRating.add(c.getRating());
                ratedCount++;
            }
        }

        BigDecimal averageRating = ratedCount > 0 ? totalRating.divide(BigDecimal.valueOf(ratedCount), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        List<Booking> bookings = getOwnerBookings(ownerEmail);

        long pendingBookings = bookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long confirmedBookings = bookings.stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
        long cancelledBookings = bookings.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();
        long completedBookings = bookings.stream().filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();

        List<Payment> payments = new ArrayList<>();
        if (!bookings.isEmpty()) {
            payments = paymentRepository.findByBookingsAndStatus(bookings, PaymentStatus.SUCCESS);
        }

        BigDecimal totalPayable = payments.stream().map(Payment::getOwnerAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCommission = payments.stream().map(Payment::getCommissionAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        return OwnerDashboardDTO.builder()
                .totalRestaurants(resCount)
                .totalHomestays(homeCount)
                .totalCabs(cabCount)
                .totalBookings(bookings.size())
                .pendingBookings(pendingBookings)
                .confirmedBookings(confirmedBookings)
                .cancelledBookings(cancelledBookings)
                .completedBookings(completedBookings)
                .totalSuccessfulPayments(payments.size())
                .totalEarningsPayable(totalPayable)
                .totalPlatformCommission(totalCommission)
                .averageRating(averageRating)
                .build();
    }

    public List<BookingResponseDTO> getOwnerBookingsResponse(String ownerEmail) {
        return getOwnerBookings(ownerEmail).stream().map(booking -> BookingResponseDTO.builder()
                .id(booking.getId())
                .customerId(booking.getCustomer().getId())
                .customerName(booking.getCustomer().getName())
                .bookingType(booking.getBookingType())
                .serviceId(booking.getServiceId())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .numberOfGuests(booking.getNumberOfGuests())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    public OwnerEarningsDTO getOwnerEarnings(String ownerEmail) {
        List<Booking> bookings = getOwnerBookings(ownerEmail);
        List<Payment> payments = new ArrayList<>();
        if (!bookings.isEmpty()) {
            payments = paymentRepository.findByBookingsAndStatus(bookings, PaymentStatus.SUCCESS);
        }

        BigDecimal totalPayable = payments.stream().map(Payment::getOwnerAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCommission = payments.stream().map(Payment::getCommissionAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        return OwnerEarningsDTO.builder()
                .totalSuccessfulPayments(payments.size())
                .totalEarningsPayable(totalPayable)
                .totalPlatformCommission(totalCommission)
                .build();
    }

    public UserResponseDTO getOwnerProfile(String ownerEmail) {
        User user = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
