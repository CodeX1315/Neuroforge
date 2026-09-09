package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface RepositoryRepository extends JpaRepository<Repository, Long> {
    List<Repository> findByProjectId(Long projectId);

    Optional<Repository> findByGitHubRepoId(String gitHubRepoId);

    boolean existsByGitHubRepoId(String gitHubRepoId);
    List<Repository> findAllByOrganization(Organization organization);
}
