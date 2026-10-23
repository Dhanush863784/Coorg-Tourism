package com.coorgtourism.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerProfileUpdateDTO {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String phone;
}
