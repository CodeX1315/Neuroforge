package com.example.neuroforge.dto;

import lombok.Builder;

@Builder
public record UpdateUserRequest(
        String name,
        String email
) {
}
