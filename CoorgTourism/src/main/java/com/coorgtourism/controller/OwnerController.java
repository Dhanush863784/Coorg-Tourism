package com.coorgtourism.controller;

import com.coorgtourism.dto.*;
import com.coorgtourism.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('OWNER')")
public class OwnerController {

    private final OwnerService ownerService;
    private final RestaurantService restaurantService;
    private final HomestayService homestayService;
    private final CabService cabService;

    public OwnerController(OwnerService ownerService,
                           RestaurantService restaurantService,
                           HomestayService homestayService,
                           CabService cabService) {
        this.ownerService = ownerService;
        this.restaurantService = restaurantService;
        this.homestayService = homestayService;
        this.cabService = cabService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<OwnerDashboardDTO> getDashboardSummary(Authentication authentication) {
        return ResponseEntity.ok(ownerService.getDashboardSummary(authentication.getName()));
    }

    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantResponseDTO>> getMyRestaurants(Authentication authentication) {
        return ResponseEntity.ok(restaurantService.getRestaurantsByOwner(authentication.getName()));
    }

    @GetMapping("/homestays")
    public ResponseEntity<List<HomestayResponseDTO>> getMyHomestays(Authentication authentication) {
        return ResponseEntity.ok(homestayService.getHomestaysByOwner(authentication.getName()));
    }

    @GetMapping("/cabs")
    public ResponseEntity<List<CabResponseDTO>> getMyCabs(Authentication authentication) {
        return ResponseEntity.ok(cabService.getCabsByOwner(authentication.getName()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getOwnerBookings(Authentication authentication) {
        return ResponseEntity.ok(ownerService.getOwnerBookingsResponse(authentication.getName()));
    }

    @GetMapping("/earnings")
    public ResponseEntity<OwnerEarningsDTO> getOwnerEarnings(Authentication authentication) {
        return ResponseEntity.ok(ownerService.getOwnerEarnings(authentication.getName()));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getOwnerProfile(Authentication authentication) {
        return ResponseEntity.ok(ownerService.getOwnerProfile(authentication.getName()));
    }
}
