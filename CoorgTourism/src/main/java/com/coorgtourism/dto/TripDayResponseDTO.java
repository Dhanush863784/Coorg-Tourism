package com.coorgtourism.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class TripDayResponseDTO {
    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private List<TouristPlaceResponseDTO> touristPlaces;
    private List<RestaurantResponseDTO> restaurants;
}
