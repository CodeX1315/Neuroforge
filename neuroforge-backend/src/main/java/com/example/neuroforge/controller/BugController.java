package com.example.neuroforge.controller;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/bug")
public class BugController {

    @Autowired
    private BugService bugService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<BugCreateResponse> createBug(@RequestBody BugCreateRequest bugCreateRequest) throws AccessDeniedException {
        BugCreateResponse response = bugService.createBug(bugCreateRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get-bug")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<BugCreateResponse> getBugByIdAndTestCase(@RequestParam Long bugId, @RequestParam Long testcaseId){
        BugCreateResponse response = bugService.getBugByIdAndTestCase(bugId, testcaseId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get-all/{testCaseId}")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<List<BugCreateResponse>> getAllBugOfTestCase(@PathVariable Long testCaseId){
        List<BugCreateResponse> responses = bugService.getAllBugOfTestCase(testCaseId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PutMapping("/update/status/{bugId}")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<UpdateBugStatus> updateBugStatus(@PathVariable Long bugId,@RequestBody UpdateBugStatus bugStatus){
        UpdateBugStatus status = bugService.updateBugStatus(bugId,bugStatus);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @PutMapping("/update/severity/{bugId}")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<UpdateBugSeverity> updateBugSeverity(@PathVariable Long bugId, @RequestBody UpdateBugSeverity bugSeverity){
        UpdateBugSeverity severity = bugService.updateBugSeverity(bugId,bugSeverity);
        return new ResponseEntity<>(severity, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{bugId}")
    @PreAuthorize("hasAuthority('QA_ENGINEER')")
    public ResponseEntity<String> deleteBug(@PathVariable Long bugId){
        bugService.deleteBugReport(bugId);
        return ResponseEntity.ok("Reported Bug Deleted");
    }
}
