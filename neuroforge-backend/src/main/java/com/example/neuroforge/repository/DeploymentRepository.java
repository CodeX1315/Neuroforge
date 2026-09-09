package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Deployment;
import com.example.neuroforge.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeploymentRepository extends JpaRepository<Deployment, Long> {
    List<Deployment> findByReleaseId(Long releaseId);

    List<Deployment> findByReleaseProjectId(Long projectId);
    List<Deployment> findAllByOrganization(Organization organization);
}
