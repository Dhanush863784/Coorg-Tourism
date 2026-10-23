package com.coorgtourism.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    
    @NotBlank(message = "Email should not be blank")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password should not be blank")
    private String password;
}
