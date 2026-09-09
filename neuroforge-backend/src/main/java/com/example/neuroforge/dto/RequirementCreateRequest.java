package com.example.neuroforge.dto;

import com.example.neuroforge.entity.RequirementPriority;
import com.example.neuroforge.entity.RequirementStatus;

public record RequirementCreateRequest(
        Long projectId,
        String title,
        String description,
        RequirementPriority requirementPriority,
        RequirementStatus requirementStatus
) {
}
