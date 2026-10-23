package com.coorgtourism.dto;

import com.coorgtourism.entity.BookingType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {

    @NotNull(message = "Booking type is required")
    private BookingType bookingType;

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "Number of guests must be greater than 0")
    private Integer numberOfGuests;
}
