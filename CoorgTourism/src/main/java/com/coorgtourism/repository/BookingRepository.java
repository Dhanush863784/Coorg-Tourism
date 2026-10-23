package com.coorgtourism.repository;

import com.coorgtourism.entity.Booking;
import com.coorgtourism.entity.BookingStatus;
import com.coorgtourism.entity.BookingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerEmailOrderByCreatedAtDesc(String email);

    @Query("SELECT b FROM Booking b WHERE b.serviceId = :serviceId AND b.bookingType = :bookingType " +
           "AND b.status IN (:statuses) " +
           "AND b.startDate <= :endDate AND b.endDate >= :startDate")
    List<Booking> findOverlappingBookings(
            @Param("serviceId") Long serviceId,
            @Param("bookingType") BookingType bookingType,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<BookingStatus> statuses);

    long countByStatus(BookingStatus status);

    List<Booking> findByServiceIdInAndBookingType(List<Long> serviceIds, BookingType bookingType);
}
