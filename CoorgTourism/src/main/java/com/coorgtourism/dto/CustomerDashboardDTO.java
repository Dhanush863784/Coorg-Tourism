package com.coorgtourism.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CustomerDashboardDTO {
    private UserResponseDTO profile;
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long completedBookings;
    private long upcomingTrips;
    private long totalSuccessfulPayments;
    private BigDecimal totalAmountPaid;
    private long totalReviewsWritten;
}
