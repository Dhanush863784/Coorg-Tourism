package com.coorgtourism.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OwnerEarningsDTO {
    private BigDecimal totalEarningsPayable;
    private BigDecimal totalPlatformCommission;
    private long totalSuccessfulPayments;
}
