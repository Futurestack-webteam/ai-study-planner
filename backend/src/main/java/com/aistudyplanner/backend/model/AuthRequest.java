package com.aistudyplanner.backend.model;

import lombok.Data;

@Data
public class AuthRequest {

    private String fullName;

    private String email;

    private String password;

    private String otp;
}