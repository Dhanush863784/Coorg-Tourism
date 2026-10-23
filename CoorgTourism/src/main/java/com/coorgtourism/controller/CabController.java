package com.coorgtourism.controller;

import com.coorgtourism.dto.CabRequestDTO;
import com.coorgtourism.dto.CabResponseDTO;
import com.coorgtourism.entity.Role;
import com.coorgtourism.entity.User;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.UserRepository;
import com.coorgtourism.service.CabService;
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
@RequestMapping("/api/cabs")
public class CabController {

    private final CabService cabService;
    private final UserRepository userRepository;

    public CabController(CabService cabService, UserRepository userRepository) {
        this.cabService = cabService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<CabResponseDTO>> getAllCabs(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) Boolean available) {
        return ResponseEntity.ok(cabService.getAllCabs(sort, minPrice, maxPrice, minRating, available));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CabResponseDTO> getCabById(@PathVariable Long id) {
        return ResponseEntity.ok(cabService.getCabById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<CabResponseDTO> createCab(
            @Valid @RequestBody CabRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        CabResponseDTO response = cabService.createCab(requestDTO, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<CabResponseDTO> updateCab(
            @PathVariable Long id,
            @Valid @RequestBody CabRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        Role callerRole = getCallerRole(userDetails.getUsername());
        CabResponseDTO response = cabService.updateCab(
                id, requestDTO, userDetails.getUsername(), callerRole);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCab(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Role callerRole = getCallerRole(userDetails.getUsername());
        cabService.deleteCab(id, userDetails.getUsername(), callerRole);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<CabResponseDTO>> getMyCabs(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cabService.getCabsByOwner(userDetails.getUsername()));
    }

    private Role getCallerRole(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return user.getRole();
    }
}
