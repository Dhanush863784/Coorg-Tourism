package com.coorgtourism.repository;

import com.coorgtourism.entity.Payment;
import com.coorgtourism.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findByStatus(PaymentStatus status);

    List<Payment> findByBookingCustomerEmailOrderByCreatedAtDesc(String email);

    long countByStatus(PaymentStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(p.commissionAmount) FROM Payment p WHERE p.status = :status")
    java.math.BigDecimal sumCommissionAmountByStatus(@org.springframework.data.repository.query.Param("status") PaymentStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Payment p WHERE p.booking IN :bookings AND p.status = :status")
    List<Payment> findByBookingsAndStatus(@org.springframework.data.repository.query.Param("bookings") List<com.coorgtourism.entity.Booking> bookings, @org.springframework.data.repository.query.Param("status") PaymentStatus status);
}
