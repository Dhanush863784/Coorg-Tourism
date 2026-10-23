package com.coorgtourism.service;

import com.coorgtourism.dto.SearchResultDTO;
import com.coorgtourism.entity.*;
import com.coorgtourism.repository.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GlobalSearchService {

    private final TouristPlaceRepository touristPlaceRepository;
    private final RestaurantRepository restaurantRepository;
    private final HomestayRepository homestayRepository;
    private final CabRepository cabRepository;

    public GlobalSearchService(TouristPlaceRepository touristPlaceRepository,
                               RestaurantRepository restaurantRepository,
                               HomestayRepository homestayRepository,
                               CabRepository cabRepository) {
        this.touristPlaceRepository = touristPlaceRepository;
        this.restaurantRepository = restaurantRepository;
        this.homestayRepository = homestayRepository;
        this.cabRepository = cabRepository;
    }

    public List<SearchResultDTO> search(String keyword, String type, BigDecimal minPrice, BigDecimal maxPrice,
                                        BigDecimal minRating, String location, String sort) {

        if (!StringUtils.hasText(keyword) && !StringUtils.hasText(location) && type == null 
                && minPrice == null && maxPrice == null && minRating == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one search parameter must be provided.");
        }

        boolean searchAll = !StringUtils.hasText(type);

        if (!searchAll && !List.of("TOURIST_PLACE", "RESTAURANT", "HOMESTAY", "CAB").contains(type)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported type: " + type);
        }

        if (StringUtils.hasText(sort) && !List.of("price_asc", "price_desc", "rating").contains(sort)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported sort: " + sort);
        }

        List<SearchResultDTO> results = new ArrayList<>();

        if (searchAll || "TOURIST_PLACE".equals(type)) {
            results.addAll(searchTouristPlaces(keyword, minPrice, maxPrice, minRating, location));
        }
        if (searchAll || "RESTAURANT".equals(type)) {
            results.addAll(searchRestaurants(keyword, minPrice, maxPrice, minRating, location));
        }
        if (searchAll || "HOMESTAY".equals(type)) {
            results.addAll(searchHomestays(keyword, minPrice, maxPrice, minRating, location));
        }
        if (searchAll || "CAB".equals(type)) {
            results.addAll(searchCabs(keyword, minPrice, maxPrice, minRating, location));
        }

        if (StringUtils.hasText(sort)) {
            switch (sort) {
                case "price_asc":
                    results.sort(Comparator.comparing(SearchResultDTO::getPrice, Comparator.nullsLast(Comparator.naturalOrder())));
                    break;
                case "price_desc":
                    results.sort(Comparator.comparing(SearchResultDTO::getPrice, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                case "rating":
                    results.sort(Comparator.comparing(SearchResultDTO::getRating, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
            }
        }

        return results;
    }

    private List<SearchResultDTO> searchTouristPlaces(String keyword, BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minRating, String location) {
        Specification<TouristPlace> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate locMatch = cb.like(cb.lower(root.get("location")), pattern);
                Predicate catMatch = cb.like(cb.lower(root.get("category")), pattern);
                predicates.add(cb.or(nameMatch, descMatch, locMatch, catMatch));
            }

            if (StringUtils.hasText(location)) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("entryFee"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("entryFee"), maxPrice));
            }

            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return touristPlaceRepository.findAll(spec).stream()
                .map(tp -> SearchResultDTO.builder()
                        .id(tp.getId())
                        .type("TOURIST_PLACE")
                        .name(tp.getName())
                        .description(tp.getDescription())
                        .location(tp.getLocation())
                        .price(tp.getEntryFee())
                        .priceUnit("ENTRY_FEE")
                        .rating(tp.getRating())
                        .imageUrl(tp.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

    private List<SearchResultDTO> searchRestaurants(String keyword, BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minRating, String location) {
        Specification<Restaurant> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate locMatch = cb.like(cb.lower(root.get("location")), pattern);
                predicates.add(cb.or(nameMatch, descMatch, locMatch));
            }

            if (StringUtils.hasText(location)) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return restaurantRepository.findAll(spec).stream()
                .map(r -> SearchResultDTO.builder()
                        .id(r.getId())
                        .type("RESTAURANT")
                        .name(r.getName())
                        .description(r.getDescription())
                        .location(r.getLocation())
                        .price(r.getPrice())
                        .priceUnit("SERVICE_PRICE")
                        .rating(r.getRating())
                        .imageUrl(r.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

    private List<SearchResultDTO> searchHomestays(String keyword, BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minRating, String location) {
        Specification<Homestay> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate locMatch = cb.like(cb.lower(root.get("location")), pattern);
                predicates.add(cb.or(nameMatch, descMatch, locMatch));
            }

            if (StringUtils.hasText(location)) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("pricePerNight"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("pricePerNight"), maxPrice));
            }

            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return homestayRepository.findAll(spec).stream()
                .map(h -> SearchResultDTO.builder()
                        .id(h.getId())
                        .type("HOMESTAY")
                        .name(h.getName())
                        .description(h.getDescription())
                        .location(h.getLocation())
                        .price(h.getPricePerNight())
                        .priceUnit("PER_NIGHT")
                        .rating(h.getRating())
                        .imageUrl(h.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

    private List<SearchResultDTO> searchCabs(String keyword, BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minRating, String location) {
        Specification<Cab> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Only available cabs
            predicates.add(cb.isTrue(root.get("available")));

            if (StringUtils.hasText(keyword)) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                Predicate typeMatch = cb.like(cb.lower(root.get("vehicleType")), pattern);
                Predicate locMatch = cb.like(cb.lower(root.get("location")), pattern);
                predicates.add(cb.or(typeMatch, locMatch));
            }

            if (StringUtils.hasText(location)) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("pricePerDay"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("pricePerDay"), maxPrice));
            }

            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return cabRepository.findAll(spec).stream()
                .map(c -> SearchResultDTO.builder()
                        .id(c.getId())
                        .type("CAB")
                        .name(c.getVehicleType() + " (" + c.getVehicleNumber() + ")") // Combining type and number as name
                        .description("Driver: " + c.getDriverName())
                        .location(c.getLocation())
                        .price(c.getPricePerDay())
                        .priceUnit("PER_DAY")
                        .rating(c.getRating())
                        .imageUrl(c.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }
}
