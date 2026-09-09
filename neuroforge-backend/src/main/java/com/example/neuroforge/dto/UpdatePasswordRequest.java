package com.example.neuroforge.dto;

public record UpdatePasswordRequest(
        String oldPassword,
        String newPassword,
        String confirmedPassword
) {
}
