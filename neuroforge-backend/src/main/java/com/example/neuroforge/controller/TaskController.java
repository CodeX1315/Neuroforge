package com.example.neuroforge.controller;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<TaskCreateResponse> createTask(@RequestBody TaskCreateRequest createRequest) throws AccessDeniedException {
        TaskCreateResponse response = taskService.createTask(createRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get/{taskId}")
    @PreAuthorize("hasAnyAuthority('PROJECT_MANAGER','ADMIN','QA_ENGINEER')")
    public ResponseEntity<TaskCreateResponse> getTaskById(@PathVariable Long taskId) throws AccessDeniedException {
        TaskCreateResponse response = taskService.getTaskById(taskId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get/sprint/{sprintId}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<List<TaskCreateResponse>> getTaskBySprint(@PathVariable Long sprintId) throws AccessDeniedException {
        List<TaskCreateResponse> responses = taskService.getTaskBySprint(sprintId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/get/req/{requirementId}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<List<TaskCreateResponse>> getTaskByRequirement(@PathVariable Long requirementId) throws AccessDeniedException {
        List<TaskCreateResponse> responses = taskService.getTaskByRequirement(requirementId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/get/sprint")
    @PreAuthorize("hasAnyAuthority('PROJECT_MANAGER','DEVELOPER')")
    public ResponseEntity<List<TaskCreateResponse>> getTaskBySprintAndAssignedDeveloper(@RequestParam Long developerId,@RequestParam Long sprintId) throws AccessDeniedException {
        List<TaskCreateResponse> responses = taskService.getTaskBySprintAndAssignedDeveloper(developerId, sprintId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/get/req")
    @PreAuthorize("hasAnyAuthority('PROJECT_MANAGER','DEVELOPER')")
    public ResponseEntity<List<TaskCreateResponse>> getTaskByReqAndAssignedDeveloper(@RequestParam Long developerId, @RequestParam Long reqId) throws AccessDeniedException {
        List<TaskCreateResponse> responses = taskService.getTaskByRequirementAndAssignedDeveloper(developerId, reqId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @DeleteMapping("/delete-sprint")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<String> deleteTaskBySprint(@RequestBody DeleteTaskBySprint deleteTaskBySprint) throws AccessDeniedException {
        taskService.deleteTaskGenerateFromSprint(deleteTaskBySprint);
        return ResponseEntity.ok("Task Deleted Successfully");
    }

    @DeleteMapping("/delete-req")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<String> deleteTaskByReq(@RequestBody DeleteTaskByRequirement deleteTaskByRequirement) throws AccessDeniedException {
        taskService.deleteTaskGenerateFromRequirement(deleteTaskByRequirement);
        return ResponseEntity.ok("Task Deleted Successfully");
    }

    @PutMapping("/update/status/{taskId}")
    @PreAuthorize("hasAnyAuthority('PROJECT_MANAGER','DEVELOPER')")
    public ResponseEntity<UpdateTaskStatus> updateTaskStatus(@PathVariable Long taskId,@RequestBody UpdateTaskStatus updateTaskStatus) throws AccessDeniedException {
        UpdateTaskStatus response = taskService.updateTaskStatus(taskId,updateTaskStatus.taskStatus());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update/priority/{taskId}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<UpdateTaskPriority> updateTaskPriority(@PathVariable Long taskId,@RequestBody UpdateTaskPriority updateTaskPriority) throws AccessDeniedException {
        UpdateTaskPriority response = taskService.updateTaskPriority(taskId,updateTaskPriority.taskPriority());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update/description/{taskId}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<UpdateTaskDescription> updateTaskDescription(@PathVariable Long taskId,@RequestBody UpdateTaskDescription updateTaskDescription) throws AccessDeniedException {
        UpdateTaskDescription response = taskService.updateTaskDescription(taskId,updateTaskDescription);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}

