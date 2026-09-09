package com.example.neuroforge.dto;

import com.example.neuroforge.entity.ProjectStatus;

import java.time.LocalDate;


public record ProjectCreateRequest(
        String title,
        String description,
        ProjectStatus projectStatus,
        LocalDate start_date,
        LocalDate end_date
) { }
