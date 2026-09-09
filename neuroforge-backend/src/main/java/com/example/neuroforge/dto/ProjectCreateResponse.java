package com.example.neuroforge.dto;

import com.example.neuroforge.entity.ProjectStatus;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record ProjectCreateResponse(
        Long id,
        String title,
        String description,
        ProjectStatus projectStatus,
        LocalDate start_date,
        LocalDate end_date
) { }
