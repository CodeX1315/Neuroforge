package com.example.neuroforge.controller;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.service.ProjectService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<ProjectCreateResponse> createNewProject(@RequestBody ProjectCreateRequest projectCreateRequest) throws BadRequestException {
        ProjectCreateResponse createResponse = projectService.createProject(projectCreateRequest);
        return new ResponseEntity<>(createResponse, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<?> updateProjectStatus(@PathVariable Long id, @RequestBody UpdateProjectStatusRequest statusRequest) throws AccessDeniedException {
        projectService.updateProjectStatus(id, statusRequest.projectStatus());
        return ResponseEntity.ok("Status updated");
    }

    @GetMapping("/all-projects")
    @PreAuthorize("hasAnyAuthority('PROJECT_MANAGER','ADMIN')")
    public ResponseEntity<List<ProjectCreateResponse>> getAllProjects(){
        return projectService.getAllProjectsOfProjectManager();
    }

    @GetMapping("/project/{id}")
    @PreAuthorize("hasAnyAuthority('PROJECT_MANAGER','BUSINESS_ANALYST','DEVELOPER','QA_ENGINEER','DEVOPS_ENGINEER')")
    public ResponseEntity<ProjectCreateResponse> getProjectById(@PathVariable Long id) throws AccessDeniedException {
        ProjectCreateResponse response = projectService.getProjectById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/edit/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<ProjectCreateResponse> editProject(@PathVariable Long id,@RequestBody UpdateProjectRequest createRequest) throws AccessDeniedException {
        ProjectCreateResponse response = projectService.editProjectInfo(id, createRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) throws AccessDeniedException {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Project Deleted");
    }
}
