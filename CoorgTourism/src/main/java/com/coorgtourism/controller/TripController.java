package com.coorgtourism.controller;

import com.coorgtourism.dto.TripRequestDTO;
import com.coorgtourism.dto.TripResponseDTO;
import com.coorgtourism.entity.Role;
import com.coorgtourism.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<TripResponseDTO> generateTripRoadmap(@RequestBody TripRequestDTO requestDTO, Authentication authentication) {
        String email = authentication.getName();
        TripResponseDTO response = tripService.generateTripRoadmap(requestDTO, email);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-trips")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<TripResponseDTO>> getMyTrips(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(tripService.getMyTrips(email));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<TripResponseDTO> getTripById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        Role role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(r -> r.replace("ROLE_", ""))
                .map(Role::valueOf)
                .findFirst()
                .orElse(Role.CUSTOMER);
                
        return ResponseEntity.ok(tripService.getTripById(id, email, role));
    }
}
