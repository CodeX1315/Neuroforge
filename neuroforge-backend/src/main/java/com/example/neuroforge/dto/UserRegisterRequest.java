package com.example.neuroforge.dto;

public record UserRegisterRequest(
        String name,
        String email,
        String password,
        String inviteCode
) { }
