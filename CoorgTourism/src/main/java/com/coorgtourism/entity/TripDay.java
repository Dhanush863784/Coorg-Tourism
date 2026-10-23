package com.coorgtourism.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trip_days")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private Integer dayNumber;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToMany
    @JoinTable(
            name = "trip_day_tourist_places",
            joinColumns = @JoinColumn(name = "trip_day_id"),
            inverseJoinColumns = @JoinColumn(name = "tourist_place_id")
    )
    @Builder.Default
    private List<TouristPlace> touristPlaces = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "trip_day_restaurants",
            joinColumns = @JoinColumn(name = "trip_day_id"),
            inverseJoinColumns = @JoinColumn(name = "restaurant_id")
    )
    @Builder.Default
    private List<Restaurant> restaurants = new ArrayList<>();
}
