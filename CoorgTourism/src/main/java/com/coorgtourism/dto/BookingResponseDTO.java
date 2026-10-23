package com.coorgtourism.dto;

import com.coorgtourism.entity.BookingStatus;
import com.coorgtourism.entity.BookingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {

    private Long id;
    private Long customerId;
    private String customerName;
    private BookingType bookingType;
    private Long serviceId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfGuests;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private LocalDateTime createdAt;
}
