package com.coorgtourism.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TouristPlaceResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String category;
    private String location;
    private BigDecimal entryFee;
    private String openingTime;
    private String closingTime;
    private String imageUrl;
    private BigDecimal rating;
}
