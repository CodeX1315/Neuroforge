package com.example.neuroforge.dto;

import com.example.neuroforge.entity.ProjectStatus;

public record UpdateProjectStatusRequest(
        ProjectStatus projectStatus
) {
}
