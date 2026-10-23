package com.coorgtourism.controller;

import com.coorgtourism.dto.*;
import com.coorgtourism.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    private final CustomerService customerService;
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final TripService tripService;
    private final ReviewService reviewService;

    public CustomerController(CustomerService customerService,
                              BookingService bookingService,
                              PaymentService paymentService,
                              TripService tripService,
                              ReviewService reviewService) {
        this.customerService = customerService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
        this.tripService = tripService;
        this.reviewService = reviewService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<CustomerDashboardDTO> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(customerService.getDashboardSummary(authentication.getName()));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getProfile(Authentication authentication) {
        return ResponseEntity.ok(customerService.getProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponseDTO> updateProfile(
            Authentication authentication,
            @Valid @RequestBody CustomerProfileUpdateDTO updateDTO) {
        return ResponseEntity.ok(customerService.updateProfile(authentication.getName(), updateDTO));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookings(authentication.getName()));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponseDTO>> getMyPayments(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getMyPayments(authentication.getName()));
    }

    @GetMapping("/trips")
    public ResponseEntity<List<TripResponseDTO>> getMyTrips(Authentication authentication) {
        return ResponseEntity.ok(tripService.getMyTrips(authentication.getName()));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getMyReviews(Authentication authentication) {
        return ResponseEntity.ok(reviewService.getMyReviews(authentication.getName()));
    }
}
