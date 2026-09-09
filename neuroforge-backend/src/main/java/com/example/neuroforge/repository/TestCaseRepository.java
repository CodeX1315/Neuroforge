package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Task;
import com.example.neuroforge.entity.TestCase;
import com.example.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    boolean existsByTitleAndTask(String title, Task task);
    List<TestCase> findAllByTask(Task task);
    List<TestCase> findAllByTaskAndQaEngineer(Task task,User user);
    List<TestCase> findAllByOrganization(Organization organization);
}
