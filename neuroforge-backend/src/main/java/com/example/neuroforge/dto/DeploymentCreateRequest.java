package com.example.neuroforge.dto;

import com.example.neuroforge.entity.Environment;

public record DeploymentCreateRequest(
        Long releaseId,
        Long devopsEngineerId,
        Environment environment
) {
}
