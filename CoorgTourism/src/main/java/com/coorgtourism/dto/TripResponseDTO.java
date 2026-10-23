package com.coorgtourism.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TripResponseDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfDays;
    private List<TripDayResponseDTO> tripDays;
    private LocalDateTime createdAt;
}
