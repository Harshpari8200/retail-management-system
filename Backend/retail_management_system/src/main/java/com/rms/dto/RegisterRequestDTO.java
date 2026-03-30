package com.rms.dto;

import com.rms.model.enums.Role;
import lombok.Data;

@Data
public class RegisterRequestDTO {

    private String username;
    private String email;
    private String password;
    private String phone;
    private String address;
    private Role role;

    //for Wholesaler
    private String businessName;
    private String gstNumber;

    //for localseller
    private String shopName;
    private String city;
    private String state;

    // For salesman
    private String region;
    private Long wholesalerId;

}
