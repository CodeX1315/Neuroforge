package com.example.neuroforge.dto;

import com.example.neuroforge.entity.RequirementPriority;
import com.example.neuroforge.entity.RequirementStatus;
import lombok.Builder;

@Builder
public record RequirementCreateResponse(
        Long id,
        String title,
        String description,
        RequirementPriority requirementPriority,
        RequirementStatus requirementStatus

) { }
