package com.example.neuroforge.controller;

import com.example.neuroforge.dto.RequirementCreateRequest;
import com.example.neuroforge.dto.RequirementCreateResponse;
import com.example.neuroforge.dto.RequirementStausUpdateRequest;
import com.example.neuroforge.dto.UpdateRequirementRequest;
import com.example.neuroforge.service.RequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/requirement")
public class RequirementController {
    @Autowired
    private RequirementService requirementService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('BUSINESS_ANALYST')")
    public ResponseEntity<RequirementCreateResponse> createRequirement(@RequestBody RequirementCreateRequest createRequest) throws AccessDeniedException, ReflectiveOperationException {
        RequirementCreateResponse response = requirementService.createRequirement(createRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/get-requirement/{id}")
    @PreAuthorize("hasAuthority('BUSINESS_ANALYST')")
    public ResponseEntity<RequirementCreateResponse> getRequirementById(@PathVariable Long id) throws AccessDeniedException {
        RequirementCreateResponse response = requirementService.getRequirementById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/all-requirements")
    @PreAuthorize("hasAnyAuthority('BUSINESS_ANALYST','ADMIN')")
    public ResponseEntity<List<RequirementCreateResponse>> getAllRequirements(){
        return requirementService.getAllRequirement();
    }

    @GetMapping("/all-requirements/ba/{projectId}")
    @PreAuthorize("hasAuthority('BUSINESS_ANALYST')")//particular project
    public ResponseEntity<List<RequirementCreateResponse>> getAllRequirementsCreatedByBA(@PathVariable Long projectId){
        return requirementService.getAllRequirementCreatedByBusinessAnalyst(projectId);
    }

    @PutMapping("/update/{id}/status")
    @PreAuthorize(("hasAuthority('BUSINESS_ANALYST')"))
    public ResponseEntity<?> updateRequirementStatus(@PathVariable Long id, @RequestBody RequirementStausUpdateRequest updateRequest) throws AccessDeniedException {
        requirementService.updateStatus(id, updateRequest.requirementStatus());
        return new ResponseEntity<>("Status updated", HttpStatus.CREATED);
    }

    @PatchMapping("/update/edit/{requirementId}")
    @PreAuthorize("hasAuthority('BUSINESS_ANALYST')")
    public ResponseEntity<RequirementCreateResponse> updateRequirement(@PathVariable Long requirementId,@RequestBody UpdateRequirementRequest requirementRequest) throws AccessDeniedException {
        RequirementCreateResponse response = requirementService.editRequirementInfo(requirementId,requirementRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('BUSINESS_ANALYST')")
    public ResponseEntity<?> deleteRequirement(@PathVariable Long id) throws AccessDeniedException {
        requirementService.deleteRequirement(id);
        return ResponseEntity.ok("Requirement Deleted");
    }
}
