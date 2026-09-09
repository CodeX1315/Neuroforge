package com.example.neuroforge.service;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.entity.*;
import com.example.neuroforge.mapper.TaskMapper;
import com.example.neuroforge.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private SprintRepository sprintRepository;
    @Autowired
    private RequirementRepository requirementRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private TaskMapper taskMapper;

    @Transactional
    public TaskCreateResponse createTask(TaskCreateRequest createRequest) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Sprint sprint = sprintRepository.findById(createRequest.sprintId()).orElseThrow(() -> new RuntimeException("Sprint not found"));
        Requirement requirement = requirementRepository.findById(createRequest.requirementId()).orElseThrow(() -> new RuntimeException("Requirement not found"));
        User assignedDeveloper = userRepository.findById(createRequest.assignedDeveloperId()).orElseThrow(() -> new UsernameNotFoundException("Assigned developer not found"));
        Project project = projectRepository.findById(sprint.getProject().getId()).orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getProjectManager().getId().equals(projectManager.getId())) {
            throw new AccessDeniedException("You are not assigned for this project");
        }

        if (!sprint.getProject().getId().equals(requirement.getProject().getId())) {
            throw new RuntimeException("Sprint and Requirement must belong to the same project");
        }

        if (!sprint.getOrganization().getId().equals(projectManager.getOrganization().getId())) {
            throw new RuntimeException("Sprint belongs to another organization");
        }

        if (!requirement.getOrganization().getId().equals(projectManager.getOrganization().getId())) {
            throw new RuntimeException("Requirement belongs to another organization");
        }

        if (!assignedDeveloper.getOrganization().getId().equals(projectManager.getOrganization().getId())) {
            throw new RuntimeException("Developer belongs to another organization");
        }


        if (assignedDeveloper.getRole() != Role.DEVELOPER) {
            throw new RuntimeException("Task can only be assigned to a developer");
        }

        if (taskRepository.existsByTitleAndProjectManagerAndSprint(createRequest.title(), projectManager, sprint)){
            throw new RuntimeException("Task already exist for this sprint");
        }
        if (taskRepository.existsByTitleAndProjectManagerAndRequirement(createRequest.title(), projectManager, requirement)){
            throw new RuntimeException("Task already exist for this requirement");
        }

        Task task = Task.builder()
                .requirement(requirement)
                .sprint(sprint)
                .assignedDeveloper(assignedDeveloper)
                .projectManager(projectManager)
                .organization(projectManager.getOrganization())
                .title(createRequest.title())
                .description(createRequest.description())
                .taskPriority(createRequest.taskPriority())
                .estimatedHours(createRequest.estimatedHours())
                .taskStatus(TaskStatus.TODO)
                .build();
        Task savedTask = taskRepository.save(task);
        return taskMapper.taskCreateDto(savedTask);
    }

    public TaskCreateResponse getTaskById(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        if (!user.getOrganization().getId().equals(task.getOrganization().getId())) {
            throw new AccessDeniedException("You can't receive task of another organization");
        }

        if (user.getRole() == Role.PROJECT_MANAGER) {

            if (!user.getId().equals(task.getProjectManager().getId())) {
                throw new AccessDeniedException(
                        "You can't receive task created by other Project Manager");
            }
        }

        return taskMapper.taskCreateDto(task);
    }

    public List<TaskCreateResponse> getTaskBySprint(Long sprintId) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Sprint sprint = sprintRepository.findById(sprintId).orElseThrow(() -> new RuntimeException("Sprint not found"));
        Project project = projectRepository.findById(sprint.getProject().getId()).orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getProjectManager().getId().equals(projectManager.getId())) {
            throw new AccessDeniedException("You are not assigned for this project");
        }

        if (!sprint.getProject().getId().equals(project.getId())) {
            throw new RuntimeException("Sprint must belong to same project");
        }

        List<Task> tasks = new ArrayList<>();
        tasks = taskRepository.getAllBySprint(sprint);
        return tasks.stream()
                .map(task -> TaskCreateResponse.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .assignedDeveloperId(task.getAssignedDeveloper().getId())
                        .taskStatus(task.getTaskStatus())
                        .taskPriority(task.getTaskPriority())
                        .description(task.getDescription())
                        .estimatedHours(task.getEstimatedHours())
                        .build()
                ).toList();
    }

    public List<TaskCreateResponse> getTaskByRequirement(Long requirementId) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Requirement requirement = requirementRepository.findById(requirementId).orElseThrow(() -> new RuntimeException("Requirement not found"));
        Project project = projectRepository.findById(requirement.getProject().getId()).orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getProjectManager().getId().equals(projectManager.getId())) {
            throw new AccessDeniedException("You are not assigned for this project");
        }

        if (!requirement.getProject().getId().equals(project.getId())) {
            throw new RuntimeException("Requirement must belong to same project");
        }

        List<Task> tasks = new ArrayList<>();
        tasks = taskRepository.getAllByRequirement(requirement);
        return tasks.stream()
                .map(task -> TaskCreateResponse.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .assignedDeveloperId(task.getAssignedDeveloper().getId())
                        .taskStatus(task.getTaskStatus())
                        .taskPriority(task.getTaskPriority())
                        .description(task.getDescription())
                        .estimatedHours(task.getEstimatedHours())
                        .build()
                ).toList();
    }

    public List<TaskCreateResponse> getTaskBySprintAndAssignedDeveloper(Long developerId, Long sprintId) throws AccessDeniedException {

        String email = Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()
        ).getName();

        // Get the currently logged-in user instead of
        // assuming that the logged-in user is a Project Manager.
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        Project project = projectRepository.findById(sprint.getProject().getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // If Developer is calling this API,
        // don't trust developerId coming from the frontend.
        if (currentUser.getRole() == Role.DEVELOPER) {
            developerId = currentUser.getId();
        }

        User assignedDeveloper = userRepository.findById(developerId)
                .orElseThrow(() -> new UsernameNotFoundException("Developer not found"));

        // Project Manager should only access projects
        // that they manage.
        if (currentUser.getRole() == Role.PROJECT_MANAGER) {

            if (!project.getProjectManager().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException(
                        "You are not the Project Manager of this project"
                );
            }
        }

        // Developer can only access their own tasks.
        if (currentUser.getRole() == Role.DEVELOPER) {

            if (!assignedDeveloper.getId().equals(currentUser.getId())) {
                throw new AccessDeniedException(
                        "You can only view your own assigned tasks"
                );
            }
        }

        // Organization validation
        if (!sprint.getOrganization().getId()
                .equals(assignedDeveloper.getOrganization().getId())) {

            throw new AccessDeniedException(
                    "Developer is not from your organization"
            );
        }

        // Make sure sprint belongs to the project
        if (!sprint.getProject().getId().equals(project.getId())) {
            throw new RuntimeException(
                    "Sprint must belong to the same project"
            );
        }

        List<Task> tasks =
                taskRepository.getAllBySprintAndAssignedDeveloper(
                        sprint,
                        assignedDeveloper
                );

        return tasks.stream()
                .map(task -> TaskCreateResponse.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .assignedDeveloperId(
                                task.getAssignedDeveloper().getId()
                        )
                        .taskStatus(task.getTaskStatus())
                        .taskPriority(task.getTaskPriority())
                        .description(task.getDescription())
                        .estimatedHours(task.getEstimatedHours())
                        .build()
                )
                .toList();
    }

    public List<TaskCreateResponse> getTaskByRequirementAndAssignedDeveloper(Long developerId, Long reqId) throws AccessDeniedException {

        String email = Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()
        ).getName();

        //  Get currently logged-in user
        // instead of assuming the user is a Project Manager.
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Requirement requirement = requirementRepository.findById(reqId)
                .orElseThrow(() -> new RuntimeException("Requirement not found"));

        Project project = projectRepository.findById(requirement.getProject().getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));


        // Developer's developerId should NOT come from the frontend.
        // Always use the logged-in Developer's ID.
        if (currentUser.getRole() == Role.DEVELOPER) {
            developerId = currentUser.getId();
        }

        User assignedDeveloper = userRepository.findById(developerId)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Developer not found")
                );


        // Only check Project Manager ownership when the logged-in
        // user is actually a Project Manager.
        if (currentUser.getRole() == Role.PROJECT_MANAGER) {

            if (!project.getProjectManager().getId()
                    .equals(currentUser.getId())) {

                throw new AccessDeniedException(
                        "You are not the Project Manager of this project"
                );
            }
        }


        // Developer can only access their own tasks.
        if (currentUser.getRole() == Role.DEVELOPER) {

            if (!assignedDeveloper.getId()
                    .equals(currentUser.getId())) {

                throw new AccessDeniedException(
                        "You can only view your own assigned tasks"
                );
            }
        }

        // Organization validation
        if (!assignedDeveloper.getOrganization().getId()
                .equals(requirement.getOrganization().getId())) {

            throw new AccessDeniedException(
                    "Developer is not from your organization"
            );
        }

        // Make sure requirement belongs to the project
        if (!requirement.getProject().getId()
                .equals(project.getId())) {

            throw new RuntimeException(
                    "Requirement must belong to the same project"
            );
        }

        List<Task> tasks = taskRepository.getAllByRequirementAndAssignedDeveloper(
                        requirement,
                        assignedDeveloper
                );

        return tasks.stream()
                .map(task -> TaskCreateResponse.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .assignedDeveloperId(
                                task.getAssignedDeveloper().getId()
                        )
                        .taskStatus(task.getTaskStatus())
                        .taskPriority(task.getTaskPriority())
                        .description(task.getDescription())
                        .estimatedHours(task.getEstimatedHours())
                        .build()
                )
                .toList();
    }

    public void deleteTaskGenerateFromSprint(DeleteTaskBySprint deleteTaskBySprint) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(deleteTaskBySprint.taskId()).orElseThrow(() -> new RuntimeException("Task not found"));
        Sprint sprint = sprintRepository.findById(deleteTaskBySprint.sprintId()).orElseThrow(() -> new RuntimeException("Sprint not found"));

        if (!sprint.getId().equals(task.getSprint().getId())) {
            throw new RuntimeException("This task not belong to requested sprint");
        }

        if (!projectManager.getId().equals(task.getProjectManager().getId())) {
            throw new RuntimeException("You can't remove task that created by another Project Manager");
        }

        if (!projectManager.getOrganization().getId().equals(task.getOrganization().getId())) {
            throw new AccessDeniedException("You can't remove task of another organization");
        }
        taskRepository.delete(task);
    }

    public void deleteTaskGenerateFromRequirement(DeleteTaskByRequirement deleteTaskByRequirement) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(deleteTaskByRequirement.taskId()).orElseThrow(() -> new RuntimeException("Task not found"));
        Requirement requirement = requirementRepository.findById(deleteTaskByRequirement.requirementId()).orElseThrow(() -> new RuntimeException("Sprint not found"));

        if (!requirement.getId().equals(task.getRequirement().getId())) {
            throw new RuntimeException("This task not belong to requested requirement");
        }

        if (!projectManager.getId().equals(task.getProjectManager().getId())) {
            throw new RuntimeException("You can't remove task that created by another Project Manager");
        }

        if (!projectManager.getOrganization().getId().equals(task.getOrganization().getId())) {
            throw new AccessDeniedException("You can't remove task of another organization");
        }
        taskRepository.delete(task);
    }

    public UpdateTaskStatus updateTaskStatus(Long taskId,TaskStatus taskStatus) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(taskId).orElseThrow(()-> new RuntimeException("Task not found"));


        if (user.getRole() == Role.PROJECT_MANAGER) {

            if (!user.getId().equals(task.getProjectManager().getId())) {
                throw new AccessDeniedException(
                        "You can't modify task created by other Project Manager");
            }
        }

        task.setTaskStatus(taskStatus);
        taskRepository.save(task);
        return UpdateTaskStatus.builder()
                .taskStatus(task.getTaskStatus())
                .build();
    }

    public UpdateTaskPriority updateTaskPriority(Long taskId,TaskPriority taskPriority) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(taskId).orElseThrow(()-> new RuntimeException("Task not found"));

        if (!projectManager.getId().equals(task.getProjectManager().getId())){
            throw new AccessDeniedException("You can't modify status of task which created by another project manager");
        }
        task.setTaskPriority(taskPriority);
        taskRepository.save(task);
        return UpdateTaskPriority.builder()
                .taskPriority(task.getTaskPriority())
                .build();
    }

    public UpdateTaskDescription updateTaskDescription(Long taskId,UpdateTaskDescription description) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Task task = taskRepository.findById(taskId).orElseThrow(()-> new RuntimeException("Task not found"));

        if (!projectManager.getId().equals(task.getProjectManager().getId())){
            throw new AccessDeniedException("You can't modify status of task which created by another project manager");
        }
        if (description.description()!=null){
            task.setDescription(description.description());
        }
        taskRepository.save(task);
        return UpdateTaskDescription.builder()
                .description(task.getDescription())
                .build();
    }


}
