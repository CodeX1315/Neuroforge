package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Project;
import com.example.neuroforge.entity.Sprint;
import com.example.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
        boolean existsByNameAndProjectAndOrganization(String name, Project project, Organization organization);
        List<Sprint> findAllByProjectManagerAndProject(User projectManager,Project project);
        List<Sprint> findAllByOrganization(Organization organization);
}
