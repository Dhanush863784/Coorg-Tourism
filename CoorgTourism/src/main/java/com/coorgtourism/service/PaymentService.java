package com.coorgtourism.service;

import com.coorgtourism.dto.PaymentRequestDTO;
import com.coorgtourism.dto.PaymentResponseDTO;
import com.coorgtourism.entity.Booking;
import com.coorgtourism.entity.BookingStatus;
import com.coorgtourism.entity.Payment;
import com.coorgtourism.entity.PaymentStatus;
import com.coorgtourism.entity.Role;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.BookingRepository;
import com.coorgtourism.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    private static final BigDecimal COMMISSION_RATE = new BigDecimal("0.10");

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO requestDTO, String customerEmail) {
        Booking booking = bookingRepository.findById(requestDTO.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getCustomer().getEmail().equals(customerEmail)) {
            throw new AccessDeniedException("You can only create payments for your own bookings");
        }

        Optional<Payment> existingPayment = paymentRepository.findByBookingId(booking.getId());
        if (existingPayment.isPresent()) {
            Payment p = existingPayment.get();
            if (p.getStatus() == PaymentStatus.SUCCESS) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "A successful payment already exists for this booking");
            } else if (p.getStatus() == PaymentStatus.PENDING) {
                return mapToResponse(p); // Return existing pending payment
            }
        }

        BigDecimal totalAmount = booking.getTotalAmount();
        BigDecimal commissionAmount = totalAmount.multiply(COMMISSION_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal ownerAmount = totalAmount.subtract(commissionAmount).setScale(2, RoundingMode.HALF_UP);

        Payment payment = Payment.builder()
                .booking(booking)
                .totalAmount(totalAmount)
                .commissionAmount(commissionAmount)
                .ownerAmount(ownerAmount)
                .status(PaymentStatus.PENDING)
                .build();

        return mapToResponse(paymentRepository.save(payment));
    }

    public PaymentResponseDTO getPaymentById(Long paymentId, String callerEmail, Role callerRole) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (callerRole != Role.ADMIN && !payment.getBooking().getCustomer().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only view your own payments");
        }
        return mapToResponse(payment);
    }

    public PaymentResponseDTO getPaymentByBooking(Long bookingId, String callerEmail, Role callerRole) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for this booking"));

        if (callerRole != Role.ADMIN && !payment.getBooking().getCustomer().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only view your own payments");
        }
        return mapToResponse(payment);
    }

    public List<PaymentResponseDTO> getMyPayments(String customerEmail) {
        return paymentRepository.findByBookingCustomerEmailOrderByCreatedAtDesc(customerEmail)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponseDTO processPayment(Long paymentId, String customerEmail) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (!payment.getBooking().getCustomer().getEmail().equals(customerEmail)) {
            throw new AccessDeniedException("You can only process your own payments");
        }

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment is already processed");
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaidAt(LocalDateTime.now());

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return mapToResponse(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentResponseDTO refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only successful payments can be refunded");
        }

        payment.setStatus(PaymentStatus.REFUNDED);

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        return mapToResponse(paymentRepository.save(payment));
    }

    private PaymentResponseDTO mapToResponse(Payment payment) {
        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .totalAmount(payment.getTotalAmount())
                .commissionAmount(payment.getCommissionAmount())
                .ownerAmount(payment.getOwnerAmount())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
