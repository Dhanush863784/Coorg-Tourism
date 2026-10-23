package com.coorgtourism.service;

import com.coorgtourism.dto.CabRequestDTO;
import com.coorgtourism.dto.CabResponseDTO;
import com.coorgtourism.entity.Cab;
import com.coorgtourism.entity.Role;
import com.coorgtourism.entity.User;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.CabRepository;
import com.coorgtourism.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CabService {

    private final CabRepository cabRepository;
    private final UserRepository userRepository;

    public CabService(CabRepository cabRepository, UserRepository userRepository) {
        this.cabRepository = cabRepository;
        this.userRepository = userRepository;
    }

    public CabResponseDTO createCab(CabRequestDTO requestDTO, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found: " + ownerEmail));

        Cab cab = Cab.builder()
                .owner(owner)
                .vehicleType(requestDTO.getVehicleType())
                .vehicleNumber(requestDTO.getVehicleNumber())
                .driverName(requestDTO.getDriverName())
                .driverPhone(requestDTO.getDriverPhone())
                .location(requestDTO.getLocation())
                .pricePerDay(requestDTO.getPricePerDay())
                .imageUrl(requestDTO.getImageUrl())
                .rating(requestDTO.getRating())
                .available(requestDTO.getAvailable() != null ? requestDTO.getAvailable() : true)
                .build();

        return mapToResponse(cabRepository.save(cab));
    }

    public CabResponseDTO getCabById(Long id) {
        Cab cab = cabRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cab not found with id: " + id));
        return mapToResponse(cab);
    }

    public List<CabResponseDTO> getAllCabs(String sort, BigDecimal minPrice,
                                           BigDecimal maxPrice, BigDecimal minRating, Boolean available) {
        List<Cab> cabs;

        boolean hasPriceRange = minPrice != null && maxPrice != null;
        boolean hasMinRating = minRating != null;
        boolean hasAvailable = available != null;

        if (hasAvailable) {
            if (hasPriceRange && hasMinRating) {
                cabs = cabRepository.findByAvailableAndPricePerDayBetweenAndRatingGreaterThanEqual(available, minPrice, maxPrice, minRating);
            } else if (hasPriceRange) {
                cabs = cabRepository.findByAvailableAndPricePerDayBetween(available, minPrice, maxPrice);
            } else if (hasMinRating) {
                cabs = cabRepository.findByAvailableAndRatingGreaterThanEqual(available, minRating);
            } else if ("price_asc".equalsIgnoreCase(sort)) {
                cabs = cabRepository.findByAvailableOrderByPricePerDayAsc(available);
            } else if ("price_desc".equalsIgnoreCase(sort)) {
                cabs = cabRepository.findByAvailableOrderByPricePerDayDesc(available);
            } else if ("rating".equalsIgnoreCase(sort)) {
                cabs = cabRepository.findByAvailableOrderByRatingDesc(available);
            } else {
                cabs = cabRepository.findByAvailable(available);
            }
        } else {
            if (hasPriceRange && hasMinRating) {
                cabs = cabRepository.findByPricePerDayBetweenAndRatingGreaterThanEqual(minPrice, maxPrice, minRating);
            } else if (hasPriceRange) {
                cabs = cabRepository.findByPricePerDayBetween(minPrice, maxPrice);
            } else if (hasMinRating) {
                cabs = cabRepository.findByRatingGreaterThanEqual(minRating);
            } else if ("price_asc".equalsIgnoreCase(sort)) {
                cabs = cabRepository.findAllByOrderByPricePerDayAsc();
            } else if ("price_desc".equalsIgnoreCase(sort)) {
                cabs = cabRepository.findAllByOrderByPricePerDayDesc();
            } else if ("rating".equalsIgnoreCase(sort)) {
                cabs = cabRepository.findAllByOrderByRatingDesc();
            } else {
                cabs = cabRepository.findAll();
            }
        }

        return cabs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public CabResponseDTO updateCab(Long id, CabRequestDTO requestDTO,
                                    String callerEmail, Role callerRole) {
        Cab cab = cabRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cab not found with id: " + id));

        if (callerRole != Role.ADMIN && !cab.getOwner().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only update your own cabs");
        }

        cab.setVehicleType(requestDTO.getVehicleType());
        cab.setVehicleNumber(requestDTO.getVehicleNumber());
        cab.setDriverName(requestDTO.getDriverName());
        cab.setDriverPhone(requestDTO.getDriverPhone());
        cab.setLocation(requestDTO.getLocation());
        cab.setPricePerDay(requestDTO.getPricePerDay());
        cab.setImageUrl(requestDTO.getImageUrl());
        cab.setRating(requestDTO.getRating());
        if (requestDTO.getAvailable() != null) {
            cab.setAvailable(requestDTO.getAvailable());
        }

        return mapToResponse(cabRepository.save(cab));
    }

    public void deleteCab(Long id, String callerEmail, Role callerRole) {
        Cab cab = cabRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cab not found with id: " + id));

        if (callerRole != Role.ADMIN && !cab.getOwner().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only delete your own cabs");
        }

        cabRepository.delete(cab);
    }

    public List<CabResponseDTO> getCabsByOwner(String ownerEmail) {
        List<Cab> cabs = cabRepository.findByOwnerEmail(ownerEmail);
        return cabs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private CabResponseDTO mapToResponse(Cab cab) {
        return CabResponseDTO.builder()
                .id(cab.getId())
                .vehicleType(cab.getVehicleType())
                .vehicleNumber(cab.getVehicleNumber())
                .driverName(cab.getDriverName())
                .driverPhone(cab.getDriverPhone())
                .location(cab.getLocation())
                .pricePerDay(cab.getPricePerDay())
                .imageUrl(cab.getImageUrl())
                .rating(cab.getRating())
                .available(cab.getAvailable())
                .ownerId(cab.getOwner().getId())
                .ownerName(cab.getOwner().getName())
                .build();
    }
}
