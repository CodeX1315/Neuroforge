package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Release;
import com.example.neuroforge.entity.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReleaseRepository extends JpaRepository<Release, Long> {

    List<Release> findByProjectId(Long projectId);

    List<Release> findByRepoId(Long repoId);

    Optional<Release> findByVersionAndRepoId(String version, Long repoId);

    boolean existsByVersionAndRepoId(String version, Long repoId);

    List<Release> findByRepo(Repository repository);

    boolean existsByVersionAndRepo(
            String version,
            Repository repository
    );

    List<Release> findAllByOrganization(Organization organization);
}