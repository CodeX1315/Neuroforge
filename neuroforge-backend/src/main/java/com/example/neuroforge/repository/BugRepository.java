package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Bug;
import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Task;
import com.example.neuroforge.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugRepository extends JpaRepository<Bug, Long> {
    boolean existsByTitleAndTestCaseAndTask(String title, TestCase testCase, Task task);
    List<Bug> getAllByTestCase(TestCase testCase);
    List<Bug> findAllByOrganization(Organization organization);
}
