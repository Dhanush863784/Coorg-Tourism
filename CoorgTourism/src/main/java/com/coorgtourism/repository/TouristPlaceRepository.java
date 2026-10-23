package com.coorgtourism.repository;

import com.coorgtourism.entity.TouristPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TouristPlaceRepository extends JpaRepository<TouristPlace, Long>, JpaSpecificationExecutor<TouristPlace> {

}
