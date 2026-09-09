package com.example.neuroforge.controller;

import com.example.neuroforge.dto.SprintCreateRequest;
import com.example.neuroforge.dto.SprintCreateResponse;
import com.example.neuroforge.dto.SprintUpdateRequest;
import com.example.neuroforge.dto.SprintUpdateResponse;
import com.example.neuroforge.service.SprintService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RequestMapping("/sprint")
@RestController
public class SprintController {

    @Autowired
    private SprintService sprintService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<SprintCreateResponse> createSprint(@RequestBody SprintCreateRequest createRequest) throws AccessDeniedException, ReflectiveOperationException, BadRequestException {
        SprintCreateResponse response = sprintService.createSprint(createRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/get-all/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<List<SprintCreateResponse>> getAllSprintsRelatedProject(@PathVariable Long id) throws AccessDeniedException {
        return sprintService.getAllSprintsRelatedProject(id);
    }

    @GetMapping("/get-sprint/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<SprintCreateResponse> getSprintById(@PathVariable Long id) throws AccessDeniedException {
        SprintCreateResponse response = sprintService.getSprintById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<SprintUpdateResponse> updateSprint(@PathVariable Long id,@RequestBody SprintUpdateRequest updateRequest) throws AccessDeniedException, BadRequestException {
        SprintUpdateResponse response = sprintService.updateSprint(id,updateRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<String> deleteSprint(@PathVariable Long id) throws AccessDeniedException {
        sprintService.deleteSprint(id);
        return ResponseEntity.ok("Sprint deleted successfully");
    }

}
