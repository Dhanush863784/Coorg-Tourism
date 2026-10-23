package com.coorgtourism.controller;

import com.coorgtourism.dto.TouristPlaceRequestDTO;
import com.coorgtourism.dto.TouristPlaceResponseDTO;
import com.coorgtourism.service.TouristPlaceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/tourist-places")
public class TouristPlaceController {

    private final TouristPlaceService touristPlaceService;

    public TouristPlaceController(TouristPlaceService touristPlaceService) {
        this.touristPlaceService = touristPlaceService;
    }

    @GetMapping
    public ResponseEntity<List<TouristPlaceResponseDTO>> getAllTouristPlaces(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minFee,
            @RequestParam(required = false) BigDecimal maxFee,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(touristPlaceService.getAllTouristPlaces(category, location, minFee, maxFee, minRating, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TouristPlaceResponseDTO> getTouristPlaceById(@PathVariable Long id) {
        return ResponseEntity.ok(touristPlaceService.getTouristPlaceById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TouristPlaceResponseDTO> createTouristPlace(
            @Valid @RequestBody TouristPlaceRequestDTO requestDTO) {
        TouristPlaceResponseDTO response = touristPlaceService.createTouristPlace(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TouristPlaceResponseDTO> updateTouristPlace(
            @PathVariable Long id,
            @Valid @RequestBody TouristPlaceRequestDTO requestDTO) {
        TouristPlaceResponseDTO response = touristPlaceService.updateTouristPlace(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTouristPlace(@PathVariable Long id) {
        touristPlaceService.deleteTouristPlace(id);
        return ResponseEntity.noContent().build();
    }
}
