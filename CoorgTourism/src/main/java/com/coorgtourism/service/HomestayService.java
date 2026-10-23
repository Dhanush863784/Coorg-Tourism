package com.coorgtourism.service;

import com.coorgtourism.dto.HomestayRequestDTO;
import com.coorgtourism.dto.HomestayResponseDTO;
import com.coorgtourism.entity.Homestay;
import com.coorgtourism.entity.Role;
import com.coorgtourism.entity.User;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.HomestayRepository;
import com.coorgtourism.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HomestayService {

    private final HomestayRepository homestayRepository;
    private final UserRepository userRepository;

    public HomestayService(HomestayRepository homestayRepository, UserRepository userRepository) {
        this.homestayRepository = homestayRepository;
        this.userRepository = userRepository;
    }

    public HomestayResponseDTO createHomestay(HomestayRequestDTO requestDTO, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found: " + ownerEmail));

        Homestay homestay = Homestay.builder()
                .owner(owner)
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .location(requestDTO.getLocation())
                .pricePerNight(requestDTO.getPricePerNight())
                .imageUrl(requestDTO.getImageUrl())
                .rating(requestDTO.getRating())
                .build();

        return mapToResponse(homestayRepository.save(homestay));
    }

    public HomestayResponseDTO getHomestayById(Long id) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found with id: " + id));
        return mapToResponse(homestay);
    }

    public List<HomestayResponseDTO> getAllHomestays(String sort, BigDecimal minPrice,
                                                     BigDecimal maxPrice, BigDecimal minRating) {
        List<Homestay> homestays;

        boolean hasPriceRange = minPrice != null && maxPrice != null;
        boolean hasMinRating = minRating != null;

        if (hasPriceRange && hasMinRating) {
            homestays = homestayRepository
                    .findByPricePerNightBetweenAndRatingGreaterThanEqual(minPrice, maxPrice, minRating);
        } else if (hasPriceRange) {
            homestays = homestayRepository.findByPricePerNightBetween(minPrice, maxPrice);
        } else if (hasMinRating) {
            homestays = homestayRepository.findByRatingGreaterThanEqual(minRating);
        } else if ("price_asc".equalsIgnoreCase(sort)) {
            homestays = homestayRepository.findAllByOrderByPricePerNightAsc();
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            homestays = homestayRepository.findAllByOrderByPricePerNightDesc();
        } else if ("rating".equalsIgnoreCase(sort)) {
            homestays = homestayRepository.findAllByOrderByRatingDesc();
        } else {
            homestays = homestayRepository.findAll();
        }

        return homestays.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public HomestayResponseDTO updateHomestay(Long id, HomestayRequestDTO requestDTO,
                                              String callerEmail, Role callerRole) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found with id: " + id));

        if (callerRole != Role.ADMIN && !homestay.getOwner().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only update your own homestays");
        }

        homestay.setName(requestDTO.getName());
        homestay.setDescription(requestDTO.getDescription());
        homestay.setLocation(requestDTO.getLocation());
        homestay.setPricePerNight(requestDTO.getPricePerNight());
        homestay.setImageUrl(requestDTO.getImageUrl());
        homestay.setRating(requestDTO.getRating());

        return mapToResponse(homestayRepository.save(homestay));
    }

    public void deleteHomestay(Long id, String callerEmail, Role callerRole) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found with id: " + id));

        if (callerRole != Role.ADMIN && !homestay.getOwner().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only delete your own homestays");
        }

        homestayRepository.delete(homestay);
    }

    public List<HomestayResponseDTO> getHomestaysByOwner(String ownerEmail) {
        List<Homestay> homestays = homestayRepository.findByOwnerEmail(ownerEmail);
        return homestays.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private HomestayResponseDTO mapToResponse(Homestay homestay) {
        return HomestayResponseDTO.builder()
                .id(homestay.getId())
                .name(homestay.getName())
                .description(homestay.getDescription())
                .location(homestay.getLocation())
                .pricePerNight(homestay.getPricePerNight())
                .imageUrl(homestay.getImageUrl())
                .rating(homestay.getRating())
                .ownerId(homestay.getOwner().getId())
                .ownerName(homestay.getOwner().getName())
                .build();
    }
}
