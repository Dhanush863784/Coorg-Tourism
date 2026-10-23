package com.coorgtourism.service;

import com.coorgtourism.dto.*;
import com.coorgtourism.entity.*;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final TripDayRepository tripDayRepository;
    private final UserRepository userRepository;
    private final TouristPlaceRepository touristPlaceRepository;
    private final RestaurantRepository restaurantRepository;

    public TripService(TripRepository tripRepository,
                       TripDayRepository tripDayRepository,
                       UserRepository userRepository,
                       TouristPlaceRepository touristPlaceRepository,
                       RestaurantRepository restaurantRepository) {
        this.tripRepository = tripRepository;
        this.tripDayRepository = tripDayRepository;
        this.userRepository = userRepository;
        this.touristPlaceRepository = touristPlaceRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @Transactional
    public TripResponseDTO generateTripRoadmap(TripRequestDTO requestDTO, String customerEmail) {
        if (requestDTO.getEndDate().isBefore(requestDTO.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerEmail));

        int numberOfDays = (int) ChronoUnit.DAYS.between(requestDTO.getStartDate(), requestDTO.getEndDate()) + 1;

        Trip trip = Trip.builder()
                .customer(customer)
                .startDate(requestDTO.getStartDate())
                .endDate(requestDTO.getEndDate())
                .numberOfDays(numberOfDays)
                .build();

        trip = tripRepository.save(trip);

        List<TouristPlace> allPlaces = touristPlaceRepository.findAll();
        List<Restaurant> allRestaurants = restaurantRepository.findAll();

        List<TripDay> tripDays = new ArrayList<>();
        
        for (int i = 0; i < numberOfDays; i++) {
            LocalDate currentDate = requestDTO.getStartDate().plusDays(i);
            
            TripDay tripDay = TripDay.builder()
                    .trip(trip)
                    .dayNumber(i + 1)
                    .date(currentDate)
                    .build();
            
            // Distribute places and restaurants
            if (!allPlaces.isEmpty()) {
                int placeIndex = i % allPlaces.size();
                tripDay.getTouristPlaces().add(allPlaces.get(placeIndex));
            }
            
            if (!allRestaurants.isEmpty()) {
                int resIndex = i % allRestaurants.size();
                tripDay.getRestaurants().add(allRestaurants.get(resIndex));
            }
            
            tripDays.add(tripDayRepository.save(tripDay));
        }

        trip.setTripDays(tripDays);
        return mapToResponse(trip);
    }

    public List<TripResponseDTO> getMyTrips(String customerEmail) {
        return tripRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TripResponseDTO getTripById(Long id, String callerEmail, Role callerRole) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (callerRole != Role.ADMIN && !trip.getCustomer().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only view your own trips");
        }
        return mapToResponse(trip);
    }

    private TripResponseDTO mapToResponse(Trip trip) {
        return TripResponseDTO.builder()
                .id(trip.getId())
                .customerId(trip.getCustomer().getId())
                .customerName(trip.getCustomer().getName())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .numberOfDays(trip.getNumberOfDays())
                .tripDays(trip.getTripDays().stream().map(this::mapToTripDayResponse).collect(Collectors.toList()))
                .createdAt(trip.getCreatedAt())
                .build();
    }

    private TripDayResponseDTO mapToTripDayResponse(TripDay tripDay) {
        return TripDayResponseDTO.builder()
                .id(tripDay.getId())
                .dayNumber(tripDay.getDayNumber())
                .date(tripDay.getDate())
                .touristPlaces(tripDay.getTouristPlaces().stream()
                        .map(p -> TouristPlaceResponseDTO.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .description(p.getDescription())
                                .category(p.getCategory())
                                .location(p.getLocation())
                                .entryFee(p.getEntryFee())
                                .openingTime(p.getOpeningTime())
                                .closingTime(p.getClosingTime())
                                .imageUrl(p.getImageUrl())
                                .rating(p.getRating())
                                .build())
                        .collect(Collectors.toList()))
                .restaurants(tripDay.getRestaurants().stream()
                        .map(r -> RestaurantResponseDTO.builder()
                                .id(r.getId())
                                .ownerId(r.getOwner().getId())
                                .ownerName(r.getOwner().getName())
                                .name(r.getName())
                                .description(r.getDescription())
                                .location(r.getLocation())
                                .price(r.getPrice())
                                .imageUrl(r.getImageUrl())
                                .rating(r.getRating())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
