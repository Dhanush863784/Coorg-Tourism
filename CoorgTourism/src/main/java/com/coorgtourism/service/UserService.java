package com.coorgtourism.service;

import com.coorgtourism.dto.UserRequestDTO;
import com.coorgtourism.dto.UserResponseDTO;
import com.coorgtourism.entity.User;
import com.coorgtourism.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.coorgtourism.entity.Role;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public UserResponseDTO createUser(UserRequestDTO requestDTO) {
        if (requestDTO.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot register as ADMIN");
        }
        
        User user = User.builder()
                .name(requestDTO.getName())
                .email(requestDTO.getEmail())
                .password(passwordEncoder.encode(requestDTO.getPassword()))
                .phone(requestDTO.getPhone())
                .role(requestDTO.getRole())
                .build();
                
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }
    
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return mapToResponse(user);
    }
    
    private UserResponseDTO mapToResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
