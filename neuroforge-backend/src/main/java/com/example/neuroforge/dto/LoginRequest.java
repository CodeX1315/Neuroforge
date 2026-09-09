package com.example.neuroforge.dto;

public record LoginRequest(
        String email,
        String password
) { }
