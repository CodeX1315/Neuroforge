package com.example.neuroforge.dto;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record SprintCreateResponse(
        Long id,
        String name,
        LocalDate start_date,
        LocalDate end_date,
        String goal
) { }
