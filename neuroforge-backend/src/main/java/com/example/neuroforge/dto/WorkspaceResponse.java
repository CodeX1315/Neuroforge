package com.example.neuroforge.dto;

public record WorkspaceResponse(
        Long id,
        String organizationName,
        String inviteCode
) { }
