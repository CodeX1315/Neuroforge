package com.example.neuroforge.controller;

import com.example.neuroforge.dto.ReleaseCreateRequest;
import com.example.neuroforge.dto.ReleaseResponse;
import com.example.neuroforge.dto.UpdateChangeLog;
import com.example.neuroforge.dto.UpdateReleaseStatus;
import com.example.neuroforge.service.ReleaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/release")
public class ReleaseController {

    @Autowired
    private ReleaseService releaseService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER')")
    public ResponseEntity<ReleaseResponse> createRelease(@RequestBody ReleaseCreateRequest request) throws AccessDeniedException {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(releaseService.createRelease(request));
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'BA', 'DEVELOPER', 'DEVOPS_ENGINEER')")
    public ResponseEntity<List<ReleaseResponse>> getReleasesByProject(
            @PathVariable Long projectId)
            throws AccessDeniedException {

        return ResponseEntity.ok(
                releaseService.getReleasesByProject(projectId));
    }

    @GetMapping("/repository/{repositoryId}")
    @PreAuthorize("hasAnyAuthority('ADMIN','PROJECT_MANAGER','BA','DEVELOPER','DEVOPS_ENGINEER')")
    public ResponseEntity<List<ReleaseResponse>> getReleaseByRepository(@PathVariable Long repositoryId) throws AccessDeniedException {
        return ResponseEntity.ok(releaseService.getReleaseByRepository(repositoryId));
    }

    @PatchMapping("/{releaseId}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ReleaseResponse> updateReleaseStatus(@PathVariable Long releaseId, @RequestBody UpdateReleaseStatus request) throws AccessDeniedException {
        return ResponseEntity.ok(releaseService.updateReleaseStatus(releaseId, request));
    }

    @PatchMapping("/{releaseId}/changelog")
    @PreAuthorize("hasAnyAuthority('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ReleaseResponse> updateChangeLog(@PathVariable Long releaseId, @RequestBody UpdateChangeLog request) throws AccessDeniedException {
        return ResponseEntity.ok(releaseService.updateChangeLog(releaseId, request));
    }

    @DeleteMapping("/{releaseId}")
    @PreAuthorize("hasAnyAuthority('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<String> deleteRelease(@PathVariable Long releaseId) throws AccessDeniedException {
        releaseService.deleteRelease(releaseId);
        return ResponseEntity.ok("Release deleted successfully");
    }

    @GetMapping("/{releaseId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'BA', 'DEVELOPER', 'DEVOPS_ENGINEER')")
    public ResponseEntity<ReleaseResponse> getRelease(@PathVariable Long releaseId) throws AccessDeniedException {
        return ResponseEntity.ok(releaseService.getRelease(releaseId));
    }
}