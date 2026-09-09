package com.example.neuroforge.dto;

import com.example.neuroforge.entity.DeploymentStatus;

import java.time.LocalDate;

public record DeploymentResponse(
        Long id,
        Long releaseId,
        Long devopsEngineerId,
        String environment,
        DeploymentStatus deploymentStatus,
        LocalDate deployAt
) {
}