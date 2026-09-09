package com.example.neuroforge.dto;

public record DeleteTaskByRequirement(
        Long taskId,
        Long requirementId
) {
}
