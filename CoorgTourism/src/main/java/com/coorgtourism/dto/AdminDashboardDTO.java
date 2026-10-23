package com.coorgtourism.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AdminDashboardDTO {
    private long totalUsers;
    private long totalCustomers;
    private long totalOwners;
    private long totalRestaurants;
    private long totalHomestays;
    private long totalCabs;
    private long totalTouristPlaces;
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long totalSuccessfulPayments;
    private BigDecimal totalPlatformCommission;
    private long totalReviews;
}
