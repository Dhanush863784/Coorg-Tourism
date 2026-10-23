package com.coorgtourism.repository;

import com.coorgtourism.entity.Homestay;
import com.coorgtourism.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface HomestayRepository extends JpaRepository<Homestay, Long>, JpaSpecificationExecutor<Homestay> {

    List<Homestay> findByOwnerEmail(String email);

    List<Homestay> findAllByOrderByPricePerNightAsc();

    List<Homestay> findAllByOrderByPricePerNightDesc();

    List<Homestay> findAllByOrderByRatingDesc();

    List<Homestay> findByPricePerNightBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Homestay> findByRatingGreaterThanEqual(BigDecimal minRating);

    List<Homestay> findByPricePerNightBetweenAndRatingGreaterThanEqual(
            BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minRating);
}
