package com.example.neuroforge.dto;

import com.example.neuroforge.entity.Role;
import lombok.Builder;

@Builder
public record AllUsersResponse(
        Long id,
        String name,
        String email,
        Role role
) {
}
