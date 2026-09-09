package com.example.neuroforge.controller;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.service.TestCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/testcase")
public class TestCaseController {

    @Autowired
    private TestCaseService testCaseService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<TestCaseCreateResponse> createTestCase(@RequestBody TestCaseCreateRequest createRequest){
        TestCaseCreateResponse response = testCaseService.createTestCase(createRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/get/{testCaseId}")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<TestCaseCreateResponse> getTestCaseById(@PathVariable Long testCaseId){
        TestCaseCreateResponse response = testCaseService.getTestCaseById(testCaseId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get/testcase/task/{taskId}")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<List<TestCaseCreateResponse>> getTestCasesOfTask(@PathVariable Long taskId){
        List<TestCaseCreateResponse> responses = testCaseService.getTestCasesOfTask(taskId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    //Test cases created by QA for particular Task
    @GetMapping("/get/testcase/qa-task/{taskId}")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<List<TestCaseCreateResponse>> getTestCasesCreatedByQA(@PathVariable Long taskId) throws AccessDeniedException {
        List<TestCaseCreateResponse> responses = testCaseService.getTestCasesCreatedByQA(taskId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PutMapping("/update/status/{testCaseId}")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<UpdateTestCaseStatus> updateTestCaseStatus(@PathVariable Long testCaseId, @RequestBody UpdateTestCaseStatus status) throws AccessDeniedException {
        UpdateTestCaseStatus response = testCaseService.updateTestCaseStatus(testCaseId,status);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update/step-result/{testCaseId}")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<UpdateTestCaseStepAndExpectedResult> updateTestCaseStepAndExpectedResult(@PathVariable Long testCaseId, @RequestBody UpdateTestCaseStepAndExpectedResult updateTestCase) throws AccessDeniedException {
        UpdateTestCaseStepAndExpectedResult response = testCaseService.updateTestCaseStepAndExpectedResult(testCaseId,updateTestCase);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<String> deleteTestCase(@RequestBody DeleteTestCase deleteTestCase) throws AccessDeniedException {
        testCaseService.deleteTestCase(deleteTestCase);
        return ResponseEntity.ok("Test Case deleted of this task");
    }

}
