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
public class RestaurantResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String location;
    private BigDecimal price;
    private String imageUrl;
    private BigDecimal rating;
    private Long ownerId;
    private String ownerName;
}
