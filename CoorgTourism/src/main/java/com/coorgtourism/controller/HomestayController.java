package com.coorgtourism.controller;

import com.coorgtourism.dto.HomestayRequestDTO;
import com.coorgtourism.dto.HomestayResponseDTO;
import com.coorgtourism.entity.Role;
import com.coorgtourism.entity.User;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.UserRepository;
import com.coorgtourism.service.HomestayService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/homestays")
public class HomestayController {

    private final HomestayService homestayService;
    private final UserRepository userRepository;

    public HomestayController(HomestayService homestayService, UserRepository userRepository) {
        this.homestayService = homestayService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<HomestayResponseDTO>> getAllHomestays(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minRating) {
        return ResponseEntity.ok(homestayService.getAllHomestays(sort, minPrice, maxPrice, minRating));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HomestayResponseDTO> getHomestayById(@PathVariable Long id) {
        return ResponseEntity.ok(homestayService.getHomestayById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<HomestayResponseDTO> createHomestay(
            @Valid @RequestBody HomestayRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        HomestayResponseDTO response = homestayService.createHomestay(requestDTO, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<HomestayResponseDTO> updateHomestay(
            @PathVariable Long id,
            @Valid @RequestBody HomestayRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        Role callerRole = getCallerRole(userDetails.getUsername());
        HomestayResponseDTO response = homestayService.updateHomestay(
                id, requestDTO, userDetails.getUsername(), callerRole);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHomestay(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Role callerRole = getCallerRole(userDetails.getUsername());
        homestayService.deleteHomestay(id, userDetails.getUsername(), callerRole);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<HomestayResponseDTO>> getMyHomestays(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(homestayService.getHomestaysByOwner(userDetails.getUsername()));
    }

    private Role getCallerRole(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return user.getRole();
    }
}
