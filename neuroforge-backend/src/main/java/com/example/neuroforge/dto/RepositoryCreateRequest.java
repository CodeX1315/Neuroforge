package com.example.neuroforge.dto;


public record RepositoryCreateRequest(
        Long projectId,
        String gitHubRepoId,
        String repositoryName,
        String url,
        String defaultBranch
) { }
