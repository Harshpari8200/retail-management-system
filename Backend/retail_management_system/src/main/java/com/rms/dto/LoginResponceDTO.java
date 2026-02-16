package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// SIMPLE: Login response - just what frontend needs
@Data
@AllArgsConstructor
public class LoginResponceDTO {
    private String token;
    private String role;        // For UI routing
    private Long userId;        // For API calls
    private String username;     // For display
}