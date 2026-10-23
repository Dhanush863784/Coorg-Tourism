package com.coorgtourism.repository;

import com.coorgtourism.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByCustomerEmailOrderByCreatedAtDesc(String email);
}
