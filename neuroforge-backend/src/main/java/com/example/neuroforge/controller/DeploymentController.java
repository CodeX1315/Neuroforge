package com.example.neuroforge.controller;

import com.example.neuroforge.dto.DeploymentCreateRequest;
import com.example.neuroforge.dto.DeploymentResponse;
import com.example.neuroforge.dto.UpdateDeploymentStatus;
import com.example.neuroforge.service.DeploymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/deployment")
public class DeploymentController {

    @Autowired
    private DeploymentService deploymentService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('DEVOPS_ENGINEER')")
    public ResponseEntity<DeploymentResponse> createDeployment(@RequestBody DeploymentCreateRequest request) throws AccessDeniedException {

        return ResponseEntity.status(HttpStatus.CREATED).body(deploymentService.createDeployment(request));
    }

    @GetMapping("/release/{releaseId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'BA', 'DEVELOPER', 'DEVOPS_ENGINEER')")
    public ResponseEntity<List<DeploymentResponse>> getDeploymentsByRelease(@PathVariable Long releaseId)throws AccessDeniedException {
        return ResponseEntity.ok(deploymentService.getDeploymentsByRelease(releaseId));
    }

    @GetMapping("/{deploymentId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PROJECT_MANAGER', 'BA', 'DEVELOPER', 'DEVOPS_ENGINEER')")
    public ResponseEntity<DeploymentResponse> getDeployment(@PathVariable Long deploymentId) throws AccessDeniedException {
        return ResponseEntity.ok(deploymentService.getDeployment(deploymentId));
    }

    @PatchMapping("/{deploymentId}/status")
    @PreAuthorize("hasAuthority('DEVOPS_ENGINEER')")
    public ResponseEntity<DeploymentResponse> updateDeploymentStatus(@PathVariable Long deploymentId, @RequestBody UpdateDeploymentStatus request)
            throws AccessDeniedException {

        return ResponseEntity.ok(deploymentService.updateDeploymentStatus(deploymentId, request));
    }

    @DeleteMapping("/{deploymentId}")
    @PreAuthorize("hasAuthority('DEVOPS_ENGINEER')")
    public ResponseEntity<String> deleteDeployment(@PathVariable Long deploymentId) throws AccessDeniedException {

        deploymentService.deleteDeployment(deploymentId);

        return ResponseEntity.ok("Deployment deleted successfully");
    }
}