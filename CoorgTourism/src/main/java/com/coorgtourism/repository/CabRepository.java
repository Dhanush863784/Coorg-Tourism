package com.coorgtourism.repository;

import com.coorgtourism.entity.Cab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CabRepository extends JpaRepository<Cab, Long>, JpaSpecificationExecutor<Cab> {

    List<Cab> findByOwnerEmail(String email);
    
    List<Cab> findAllByOrderByPricePerDayAsc();
    
    List<Cab> findAllByOrderByPricePerDayDesc();
    
    List<Cab> findAllByOrderByRatingDesc();
    
    List<Cab> findByPricePerDayBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Cab> findByRatingGreaterThanEqual(BigDecimal minRating);
    
    List<Cab> findByAvailable(Boolean available);
    
    List<Cab> findByAvailableOrderByPricePerDayAsc(Boolean available);
    
    List<Cab> findByAvailableOrderByPricePerDayDesc(Boolean available);
    
    List<Cab> findByAvailableOrderByRatingDesc(Boolean available);
    
    List<Cab> findByAvailableAndPricePerDayBetween(Boolean available, BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Cab> findByAvailableAndRatingGreaterThanEqual(Boolean available, BigDecimal minRating);
    
    List<Cab> findByAvailableAndPricePerDayBetweenAndRatingGreaterThanEqual(
            Boolean available, BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minRating);
            
    List<Cab> findByPricePerDayBetweenAndRatingGreaterThanEqual(
            BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minRating);
}
