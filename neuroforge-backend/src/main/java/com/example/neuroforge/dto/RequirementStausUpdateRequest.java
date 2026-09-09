package com.example.neuroforge.dto;

import com.example.neuroforge.entity.RequirementStatus;

public record RequirementStausUpdateRequest(
        RequirementStatus requirementStatus
) {
}
