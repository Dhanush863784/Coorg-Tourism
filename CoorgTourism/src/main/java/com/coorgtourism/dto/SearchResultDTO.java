package com.coorgtourism.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SearchResultDTO {
    private Long id;
    private String type; 
    private String name;
    private String description;
    private String location;
    private BigDecimal price;
    private String priceUnit; 
    private BigDecimal rating;
    private String imageUrl;
}
