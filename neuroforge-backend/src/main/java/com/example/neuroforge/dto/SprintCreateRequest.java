package com.example.neuroforge.dto;

import java.time.LocalDate;

public record SprintCreateRequest(
        Long projectId,
        String name,
        LocalDate start_date,
        LocalDate end_date,
        String goal
) { }
