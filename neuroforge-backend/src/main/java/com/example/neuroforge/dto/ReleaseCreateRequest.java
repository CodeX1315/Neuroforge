package com.example.neuroforge.dto;

public record ReleaseCreateRequest(
        Long projectId,
        Long sprintId,
        Long repositoryId,
        String version,
        String changelog
) {
}
