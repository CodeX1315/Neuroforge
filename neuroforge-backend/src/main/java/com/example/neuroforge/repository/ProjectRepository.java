package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Project;
import com.example.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    boolean existsByTitle(String title);
    boolean existsByTitleAndOrganization(String title, Organization organization);
    List<Project> findAllByProjectManagerAndOrganization(User projectManager, Organization organization);
    List<Project> findAllByOrganization(Organization organization);
}
