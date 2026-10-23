package com.coorgtourism.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TripRequestDTO {
    private LocalDate startDate;
    private LocalDate endDate;
}
