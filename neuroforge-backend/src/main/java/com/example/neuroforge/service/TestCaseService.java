package com.example.neuroforge.service;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Task;
import com.example.neuroforge.entity.TestCase;
import com.example.neuroforge.entity.User;
import com.example.neuroforge.mapper.TestCaseMapper;
import com.example.neuroforge.repository.OrganizationRepository;
import com.example.neuroforge.repository.TaskRepository;
import com.example.neuroforge.repository.TestCaseRepository;
import com.example.neuroforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class TestCaseService {
    @Autowired
    private TestCaseRepository testCaseRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TestCaseMapper testCaseMapper;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private UserRepository userRepository;

    public TestCaseCreateResponse createTestCase(TestCaseCreateRequest createRequest){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User qaEngineer = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(createRequest.taskId()).orElseThrow(() -> new RuntimeException("Task not found"));
        Organization organization = organizationRepository.findById(qaEngineer.getOrganization().getId()).orElseThrow(() -> new RuntimeException("Organization not found"));
        if (!qaEngineer.getOrganization().getId().equals(task.getOrganization().getId())){
            throw new RuntimeException("QA_Engineer and Task must belong to same organization");
        }
        if (testCaseRepository.existsByTitleAndTask(createRequest.title(), task)){
            throw new RuntimeException("Test Case already exists");
        }

        TestCase testCase = TestCase.builder()
                .task(task)
                .qaEngineer(qaEngineer)
                .organization(organization)
                .title(createRequest.title())
                .steps(createRequest.steps())
                .expectedResult(createRequest.expectedResult())
                .testCaseStatus(createRequest.testCaseStatus())
                .build();
        testCaseRepository.save(testCase);
        return testCaseMapper.testCaseCreateDto(testCase);
    }

    public TestCaseCreateResponse getTestCaseById(Long id){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User qaEngineer = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        TestCase testCase = testCaseRepository.findById(id).orElseThrow(()-> new RuntimeException("Test case not found"));
        if (!qaEngineer.getOrganization().getId().equals(testCase.getOrganization().getId())){
            throw new RuntimeException("You can't receive testcase from another organization");
        }
        if (!qaEngineer.getId().equals(testCase.getQaEngineer().getId())){
            throw new RuntimeException("You can't receive the testcase created by another QA");
        }
        return testCaseMapper.testCaseCreateDto(testCase);
    }

    public List<TestCaseCreateResponse> getTestCasesOfTask(Long taskId){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User qaEngineer = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(taskId).orElseThrow(()-> new RuntimeException("Task not found"));
        List<TestCase> testCases = new ArrayList<>();
        testCases = testCaseRepository.findAllByTask(task);
        return testCases.stream()
                .map(testCase -> TestCaseCreateResponse.builder()
                        .id(testCase.getId())
                        .taskId(testCase.getTask().getId())
                        .title(testCase.getTitle())
                        .steps(testCase.getSteps())
                        .expectedResult(testCase.getExpectedResult())
                        .testCaseStatus(testCase.getTestCaseStatus())
                        .build()).toList();
    }

    public List<TestCaseCreateResponse> getTestCasesCreatedByQA(Long taskId) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User qaEngineer = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(taskId).orElseThrow(()-> new RuntimeException("Task not found"));
        if (!qaEngineer.getOrganization().getId().equals(task.getOrganization().getId())){
            throw new AccessDeniedException("You can't receive testcases of another organization");
        }
        List<TestCase> testCases = new ArrayList<>();
        testCases = testCaseRepository.findAllByTaskAndQaEngineer(task, qaEngineer);
        return testCases.stream()
                .map(testCase -> TestCaseCreateResponse.builder()
                        .id(testCase.getId())
                        .taskId(testCase.getTask().getId())
                        .title(testCase.getTitle())
                        .steps(testCase.getSteps())
                        .expectedResult(testCase.getExpectedResult())
                        .testCaseStatus(testCase.getTestCaseStatus())
                        .build()).toList();
    }

    public UpdateTestCaseStatus updateTestCaseStatus(Long testCaseId, UpdateTestCaseStatus updateStatus) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User qaEngineer = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(updateStatus.taskId()).orElseThrow(()-> new RuntimeException("Task not found"));
        TestCase testCase = testCaseRepository.findById(testCaseId).orElseThrow(()-> new RuntimeException("Test case not found"));

        if (!task.getId().equals(testCase.getTask().getId())){
            throw new AccessDeniedException("You can't update test case of another task");
        }

        if (!testCase.getQaEngineer().getId().equals(qaEngineer.getId())){
            throw new RuntimeException("You can't modify the test case created by another QA");
        }

        testCase.setTestCaseStatus(updateStatus.testCaseStatus());
        testCaseRepository.save(testCase);
        return UpdateTestCaseStatus.builder()
                .taskId(task.getId())
                .testCaseStatus(testCase.getTestCaseStatus())
                .build();
    }

    public UpdateTestCaseStepAndExpectedResult updateTestCaseStepAndExpectedResult(Long testCaseId, UpdateTestCaseStepAndExpectedResult updateTestCase) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User qaEngineer = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(updateTestCase.taskId()).orElseThrow(()-> new RuntimeException("Task not found"));
        TestCase testCase = testCaseRepository.findById(testCaseId).orElseThrow(()-> new RuntimeException("Test case not found"));

        if (!task.getId().equals(testCase.getTask().getId())){
            throw new AccessDeniedException("You can't update test case of another task");
        }

        if (!testCase.getQaEngineer().getId().equals(qaEngineer.getId())){
            throw new RuntimeException("You can't modify the test case created by another QA");
        }
        if (updateTestCase.steps()!=null){
            testCase.setSteps(updateTestCase.steps());
        }
        if (updateTestCase.expectedResult()!=null){
            testCase.setExpectedResult(updateTestCase.expectedResult());
        }
        testCaseRepository.save(testCase);
        return UpdateTestCaseStepAndExpectedResult.builder()
                .taskId(task.getId())
                .steps(testCase.getSteps())
                .expectedResult(testCase.getExpectedResult())
                .build();

    }

    public void deleteTestCase(DeleteTestCase deleteTestCase) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User qaEngineer = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(deleteTestCase.taskId()).orElseThrow(()-> new RuntimeException("Task not found"));
        TestCase testCase = testCaseRepository.findById(deleteTestCase.testCaseId()).orElseThrow(()-> new RuntimeException("Test case not found"));

        if (!task.getId().equals(testCase.getTask().getId())){
            throw new AccessDeniedException("You can't remove test case of another task");
        }

        if (!testCase.getQaEngineer().getId().equals(qaEngineer.getId())){
            throw new RuntimeException("You can't delete the test case created by another QA");
        }

        testCaseRepository.delete(testCase);
    }
}
