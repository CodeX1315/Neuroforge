package com.example.neuroforge.dto;

import com.example.neuroforge.entity.ReleaseStatus;

import java.time.LocalDate;

public record ReleaseResponse(
        Long id,
        Long projectId,
        Long sprintId,
        Long repositoryId,
        String version,
        ReleaseStatus releaseStatus,
        LocalDate releaseDate,
        String changelog
) {
}
