package com.example.neuroforge.dto;

import com.example.neuroforge.entity.Role;

public record UpdateUserRoleRequest(
        Role role
) {
}
