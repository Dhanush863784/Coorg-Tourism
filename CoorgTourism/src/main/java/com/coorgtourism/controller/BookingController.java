package com.coorgtourism.controller;

import com.coorgtourism.dto.BookingRequestDTO;
import com.coorgtourism.dto.BookingResponseDTO;
import com.coorgtourism.entity.BookingStatus;
import com.coorgtourism.entity.Role;
import com.coorgtourism.entity.User;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.UserRepository;
import com.coorgtourism.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        BookingResponseDTO response = bookingService.createBooking(requestDTO, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getMyBookings(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Role callerRole = getCallerRole(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.getBookingById(id, userDetails.getUsername(), callerRole));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        BookingStatus status = BookingStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Role callerRole = getCallerRole(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.cancelBooking(id, userDetails.getUsername(), callerRole));
    }

    private Role getCallerRole(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return user.getRole();
    }
}
