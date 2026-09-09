package com.example.neuroforge.dto;

import java.time.LocalDate;

public record RepositoryCreateResponse(
        Long id,
        Long projectId,
        String gitHubRepoId,
        String repositoryName,
        String url,
        String defaultBranch,
        LocalDate createdAt
) {
}