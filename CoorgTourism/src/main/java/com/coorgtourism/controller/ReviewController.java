package com.coorgtourism.controller;

import com.coorgtourism.dto.ReviewRequestDTO;
import com.coorgtourism.dto.ReviewResponseDTO;
import com.coorgtourism.entity.ReviewType;
import com.coorgtourism.entity.Role;
import com.coorgtourism.entity.User;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.UserRepository;
import com.coorgtourism.service.ReviewService;
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
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public ReviewController(ReviewService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponseDTO> createReview(
            @Valid @RequestBody ReviewRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        ReviewResponseDTO response = reviewService.createReview(requestDTO, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{reviewType}/{serviceId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForService(
            @PathVariable ReviewType reviewType,
            @PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsForService(reviewType, serviceId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ReviewResponseDTO>> getMyReviews(
            @AuthenticationPrincipal UserDetails userDetails) {        
        return ResponseEntity.ok(reviewService.getMyReviews(userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ReviewResponseDTO> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        Role callerRole = getCallerRole(userDetails.getUsername());
        return ResponseEntity.ok(reviewService.updateReview(id, requestDTO, userDetails.getUsername(), callerRole));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Role callerRole = getCallerRole(userDetails.getUsername());
        reviewService.deleteReview(id, userDetails.getUsername(), callerRole);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{reviewType}/{serviceId}/summary")
    public ResponseEntity<Map<String, Object>> getReviewSummary(
            @PathVariable ReviewType reviewType,
            @PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewSummary(reviewType, serviceId));
    }

    private Role getCallerRole(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return user.getRole();
    }
}
