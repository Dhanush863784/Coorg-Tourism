package com.coorgtourism.dto;

import com.coorgtourism.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDTO {
    
    @NotBlank(message = "Name should not be blank")
    private String name;
    
    @NotBlank(message = "Email should not be blank")
    @Email(message = "Email should be a valid email")
    private String email;
    
    @NotBlank(message = "Password should not be blank")
    private String password;
    
    @NotBlank(message = "Phone should not be blank")
    private String phone;
    
    @NotNull(message = "Role should not be null")
    private Role role;
}
