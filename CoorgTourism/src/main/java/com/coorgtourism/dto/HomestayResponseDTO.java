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
public class HomestayResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String location;
    private BigDecimal pricePerNight;
    private String imageUrl;
    private BigDecimal rating;
    private Long ownerId;
    private String ownerName;
}
