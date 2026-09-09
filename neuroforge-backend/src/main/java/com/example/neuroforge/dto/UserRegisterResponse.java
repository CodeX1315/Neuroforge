package com.example.neuroforge.dto;

import com.example.neuroforge.entity.Role;

public record UserRegisterResponse(
        Long id,
        String username,
        String email,
        Role role,
        Long organizationId,
        String orgName
) {
}
