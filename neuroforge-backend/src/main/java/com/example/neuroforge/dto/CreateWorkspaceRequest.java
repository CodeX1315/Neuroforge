package com.example.neuroforge.dto;

public record CreateWorkspaceRequest(
     String organizationName,
     String adminName,
     String email,
     String password
) { }
