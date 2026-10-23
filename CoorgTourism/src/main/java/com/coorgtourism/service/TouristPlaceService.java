package com.coorgtourism.service;

import com.coorgtourism.dto.TouristPlaceRequestDTO;
import com.coorgtourism.dto.TouristPlaceResponseDTO;
import com.coorgtourism.entity.TouristPlace;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.TouristPlaceRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TouristPlaceService {

    private final TouristPlaceRepository touristPlaceRepository;

    public TouristPlaceService(TouristPlaceRepository touristPlaceRepository) {
        this.touristPlaceRepository = touristPlaceRepository;
    }

    public TouristPlaceResponseDTO createTouristPlace(TouristPlaceRequestDTO requestDTO) {
        TouristPlace place = TouristPlace.builder()
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .category(requestDTO.getCategory())
                .location(requestDTO.getLocation())
                .entryFee(requestDTO.getEntryFee())
                .openingTime(requestDTO.getOpeningTime())
                .closingTime(requestDTO.getClosingTime())
                .imageUrl(requestDTO.getImageUrl())
                .rating(requestDTO.getRating())
                .build();

        return mapToResponse(touristPlaceRepository.save(place));
    }

    public TouristPlaceResponseDTO getTouristPlaceById(Long id) {
        TouristPlace place = touristPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist Place not found with id: " + id));
        return mapToResponse(place);
    }

    public List<TouristPlaceResponseDTO> getAllTouristPlaces(
            String category, String location, BigDecimal minFee, BigDecimal maxFee, BigDecimal minRating, String sortParam) {

        Specification<TouristPlace> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(category)) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (StringUtils.hasText(location)) {
                predicates.add(cb.equal(root.get("location"), location));
            }
            if (minFee != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("entryFee"), minFee));
            }
            if (maxFee != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("entryFee"), maxFee));
            }
            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort = Sort.unsorted();
        if ("fee_asc".equalsIgnoreCase(sortParam)) {
            sort = Sort.by(Sort.Direction.ASC, "entryFee");
        } else if ("fee_desc".equalsIgnoreCase(sortParam)) {
            sort = Sort.by(Sort.Direction.DESC, "entryFee");
        } else if ("rating".equalsIgnoreCase(sortParam)) {
            sort = Sort.by(Sort.Direction.DESC, "rating");
        }

        List<TouristPlace> places = touristPlaceRepository.findAll(spec, sort);
        return places.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TouristPlaceResponseDTO updateTouristPlace(Long id, TouristPlaceRequestDTO requestDTO) {
        TouristPlace place = touristPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist Place not found with id: " + id));

        place.setName(requestDTO.getName());
        place.setDescription(requestDTO.getDescription());
        place.setCategory(requestDTO.getCategory());
        place.setLocation(requestDTO.getLocation());
        place.setEntryFee(requestDTO.getEntryFee());
        place.setOpeningTime(requestDTO.getOpeningTime());
        place.setClosingTime(requestDTO.getClosingTime());
        place.setImageUrl(requestDTO.getImageUrl());
        place.setRating(requestDTO.getRating());

        return mapToResponse(touristPlaceRepository.save(place));
    }

    public void deleteTouristPlace(Long id) {
        TouristPlace place = touristPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist Place not found with id: " + id));

        touristPlaceRepository.delete(place);
    }

    private TouristPlaceResponseDTO mapToResponse(TouristPlace place) {
        return TouristPlaceResponseDTO.builder()
                .id(place.getId())
                .name(place.getName())
                .description(place.getDescription())
                .category(place.getCategory())
                .location(place.getLocation())
                .entryFee(place.getEntryFee())
                .openingTime(place.getOpeningTime())
                .closingTime(place.getClosingTime())
                .imageUrl(place.getImageUrl())
                .rating(place.getRating())
                .build();
    }
}
