package com.coorgtourism.service;

import com.coorgtourism.dto.RestaurantRequestDTO;
import com.coorgtourism.dto.RestaurantResponseDTO;
import com.coorgtourism.entity.Restaurant;
import com.coorgtourism.entity.Role;
import com.coorgtourism.entity.User;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.RestaurantRepository;
import com.coorgtourism.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public RestaurantService(RestaurantRepository restaurantRepository,
                             UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    public RestaurantResponseDTO createRestaurant(RestaurantRequestDTO requestDTO, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found: " + ownerEmail));

        Restaurant restaurant = Restaurant.builder()
                .owner(owner)
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .location(requestDTO.getLocation())
                .price(requestDTO.getPrice())
                .imageUrl(requestDTO.getImageUrl())
                .rating(requestDTO.getRating())
                .build();

        return mapToResponse(restaurantRepository.save(restaurant));
    }

    public RestaurantResponseDTO getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return mapToResponse(restaurant);
    }

    public List<RestaurantResponseDTO> getAllRestaurants(String sort, BigDecimal minPrice,
                                                         BigDecimal maxPrice, BigDecimal minRating) {
        List<Restaurant> restaurants;

        boolean hasPriceRange = minPrice != null && maxPrice != null;
        boolean hasMinRating = minRating != null;

        if (hasPriceRange && hasMinRating) {
            restaurants = restaurantRepository
                    .findByPriceBetweenAndRatingGreaterThanEqual(minPrice, maxPrice, minRating);
        } else if (hasPriceRange) {
            restaurants = restaurantRepository.findByPriceBetween(minPrice, maxPrice);
        } else if (hasMinRating) {
            restaurants = restaurantRepository.findByRatingGreaterThanEqual(minRating);
        } else if ("price_asc".equalsIgnoreCase(sort)) {
            restaurants = restaurantRepository.findAllByOrderByPriceAsc();
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            restaurants = restaurantRepository.findAllByOrderByPriceDesc();
        } else {
            restaurants = restaurantRepository.findAll();
        }

        return restaurants.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public RestaurantResponseDTO updateRestaurant(Long id, RestaurantRequestDTO requestDTO,
                                                   String callerEmail, Role callerRole) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        if (callerRole != Role.ADMIN && !restaurant.getOwner().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only update your own restaurants");
        }

        restaurant.setName(requestDTO.getName());
        restaurant.setDescription(requestDTO.getDescription());
        restaurant.setLocation(requestDTO.getLocation());
        restaurant.setPrice(requestDTO.getPrice());
        restaurant.setImageUrl(requestDTO.getImageUrl());
        restaurant.setRating(requestDTO.getRating());

        return mapToResponse(restaurantRepository.save(restaurant));
    }

    public void deleteRestaurant(Long id, String callerEmail, Role callerRole) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        if (callerRole != Role.ADMIN && !restaurant.getOwner().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only delete your own restaurants");
        }

        restaurantRepository.delete(restaurant);
    }

    public List<RestaurantResponseDTO> getRestaurantsByOwner(String ownerEmail) {
        List<Restaurant> restaurants = restaurantRepository.findByOwnerEmail(ownerEmail);
        return restaurants.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private RestaurantResponseDTO mapToResponse(Restaurant restaurant) {
        return RestaurantResponseDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .location(restaurant.getLocation())
                .price(restaurant.getPrice())
                .imageUrl(restaurant.getImageUrl())
                .rating(restaurant.getRating())
                .ownerId(restaurant.getOwner().getId())
                .ownerName(restaurant.getOwner().getName())
                .build();
    }
}
