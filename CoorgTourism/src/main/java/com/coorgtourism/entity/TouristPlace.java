package com.coorgtourism.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "tourist_places")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TouristPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal entryFee;

    private String openingTime;
    
    private String closingTime;

    private String imageUrl;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;
}
