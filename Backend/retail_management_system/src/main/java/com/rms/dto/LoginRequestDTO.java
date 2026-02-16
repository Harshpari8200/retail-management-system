package com.rms.dto;

import lombok.Data;

// SIMPLE: Login request
@Data
public class LoginRequestDTO {
    private String email;
    private String password;
}