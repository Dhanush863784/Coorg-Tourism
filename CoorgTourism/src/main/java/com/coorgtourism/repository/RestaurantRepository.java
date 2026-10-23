package com.coorgtourism.repository;

import com.coorgtourism.entity.Restaurant;
import com.coorgtourism.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>,
        JpaSpecificationExecutor<Restaurant> {

    List<Restaurant> findByOwner(User owner);

    List<Restaurant> findByOwnerEmail(String email);

    List<Restaurant> findAllByOrderByPriceAsc();

    List<Restaurant> findAllByOrderByPriceDesc();

    List<Restaurant> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Restaurant> findByRatingGreaterThanEqual(BigDecimal minRating);

    List<Restaurant> findByPriceBetweenAndRatingGreaterThanEqual(
            BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minRating);
}
