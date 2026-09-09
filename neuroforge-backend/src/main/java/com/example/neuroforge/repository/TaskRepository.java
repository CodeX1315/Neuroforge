package com.example.neuroforge.repository;

import com.example.neuroforge.entity.*;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> getAllBySprint(Sprint sprint);
    List<Task> getAllByRequirement(Requirement requirement);
    List<Task> getAllBySprintAndAssignedDeveloper(Sprint sprint, User user);
    List<Task> getAllByRequirementAndAssignedDeveloper(Requirement requirement, User user);
    boolean existsByTitleAndProjectManagerAndSprint(String title, User user,Sprint sprint);
    boolean existsByTitleAndProjectManagerAndRequirement(String title,User user,Requirement requirement);
    List<Task> findAllByOrganization(Organization organization);
}
