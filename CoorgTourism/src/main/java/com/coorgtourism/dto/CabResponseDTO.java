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
public class CabResponseDTO {

    private Long id;
    private String vehicleType;
    private String vehicleNumber;
    private String driverName;
    private String driverPhone;
    private String location;
    private BigDecimal pricePerDay;
    private String imageUrl;
    private BigDecimal rating;
    private Boolean available;
    private Long ownerId;
    private String ownerName;
}
