package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Project;
import com.example.neuroforge.entity.Requirement;
import com.example.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequirementRepository extends JpaRepository<Requirement, Long> {
    boolean existsByTitleAndProjectAndOrganization(
            String title,
            Project projectId,
            Organization organizationId
    );
    List<Requirement> findAllByBusinessAnalyst(User businessAnalyst);
    List<Requirement> findAllByBusinessAnalystAndProject(User businessAnalyst, Project project);
    List<Requirement> findAllByOrganization(Organization organization);
}
