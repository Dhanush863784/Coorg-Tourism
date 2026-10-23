package com.coorgtourism.repository;

import com.coorgtourism.entity.TripDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripDayRepository extends JpaRepository<TripDay, Long> {
}
