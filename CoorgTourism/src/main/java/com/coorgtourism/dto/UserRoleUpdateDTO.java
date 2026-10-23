package com.coorgtourism.dto;

import com.coorgtourism.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserRoleUpdateDTO {
    @NotNull(message = "Role is required")
    private Role role;
}
