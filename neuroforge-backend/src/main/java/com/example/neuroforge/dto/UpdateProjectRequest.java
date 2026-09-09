package com.example.neuroforge.dto;

import com.example.neuroforge.entity.ProjectStatus;

import java.time.LocalDate;

public record UpdateProjectRequest(
        String title,
        String description,
        LocalDate start_date,
        LocalDate end_date
) {
}
