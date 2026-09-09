package com.example.neuroforge.controller;

import com.example.neuroforge.dto.RepositoryCreateRequest;
import com.example.neuroforge.dto.RepositoryCreateResponse;
import com.example.neuroforge.service.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/repository")
public class RepositoryController {

    @Autowired
    private RepositoryService repositoryService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<RepositoryCreateResponse> createRepository(@RequestBody RepositoryCreateRequest request) throws AccessDeniedException {

        return ResponseEntity.status(HttpStatus.CREATED).body(repositoryService.createRepository(request));
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'BA', 'DEVELOPER', 'DEVOPS_ENGINEER')")
    public ResponseEntity<List<RepositoryCreateResponse>> getRepositoriesByProject(@PathVariable Long projectId) throws AccessDeniedException {
        return ResponseEntity.ok(repositoryService.getRepositoriesByProject(projectId));
    }

    @GetMapping("/{repositoryId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'BA', 'DEVELOPER', 'DEVOPS_ENGINEER')")
    public ResponseEntity<RepositoryCreateResponse> getRepository(@PathVariable Long repositoryId) throws AccessDeniedException {
        return ResponseEntity.ok(repositoryService.getRepository(repositoryId));
    }
}
