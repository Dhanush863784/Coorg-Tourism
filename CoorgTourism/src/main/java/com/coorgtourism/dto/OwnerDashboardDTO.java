package com.coorgtourism.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OwnerDashboardDTO {
    private long totalRestaurants;
    private long totalHomestays;
    private long totalCabs;
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long completedBookings;
    private long totalSuccessfulPayments;
    private BigDecimal totalEarningsPayable;
    private BigDecimal totalPlatformCommission;
    private BigDecimal averageRating;
}
