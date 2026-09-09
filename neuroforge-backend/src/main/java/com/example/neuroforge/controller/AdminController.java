package com.example.neuroforge.controller;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<AllUsersResponse>> allUserList(){
        return adminService.allUsersList();
    }

    @PutMapping("/user/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id,@RequestBody UpdateUserRoleRequest roleRequest) throws AccessDeniedException {
        adminService.updateRole(id,roleRequest.role());
        return ResponseEntity.ok("Role updated");
    }

    @DeleteMapping("/user/{id}/delete")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) throws AccessDeniedException {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectCreateResponse>> getAllProjects(){
        return adminService.getAllProjects();
    }

    @GetMapping("/requirements")
    public ResponseEntity<List<RequirementCreateResponse>> getAllRequirements(){
        return adminService.getAllRequirements();
    }

    @GetMapping("/sprints")
    public ResponseEntity<List<SprintCreateResponse>> getAllSprints(){
        return adminService.getAllSprints();
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportCreateResponse>> getAllReports(){
        return adminService.getAllReports();
    }

    @GetMapping("/documents")
    public ResponseEntity<List<DocumentCreateResponse>> getAllDocuments(){
        return adminService.getAllDocuments();
    }

    @GetMapping("/repos")
    public ResponseEntity<List<RepositoryCreateResponse>> getAllRepos(){
        return adminService.getAllRepositories();
    }

    @GetMapping("/releases")
    public ResponseEntity<List<ReleaseResponse>> getAllReleases(){
        return adminService.getAllReleases();
    }

    @GetMapping("/deployments")
    public ResponseEntity<List<DeploymentResponse>> getAllDeployments(){
        return adminService.getAllDeployments();
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskCreateResponse>> getAllTasks(){
        return adminService.getAllTasks();
    }

    @GetMapping("/testcases")
    public ResponseEntity<List<TestCaseCreateResponse>> getAllTestCases(){
        return adminService.getAllTestCases();
    }

    @GetMapping("/bugs")
    public ResponseEntity<List<BugCreateResponse>> getAllbugs(){
        return adminService.getAllBugs();
    }
}
