package com.example.neuroforge.dto;

import com.example.neuroforge.entity.RequirementPriority;

public record UpdateRequirementRequest(
        String title,
        String description
) { }
