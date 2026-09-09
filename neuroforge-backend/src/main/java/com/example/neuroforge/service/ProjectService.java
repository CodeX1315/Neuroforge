package com.example.neuroforge.service;

import com.example.neuroforge.dto.ProjectCreateRequest;
import com.example.neuroforge.dto.ProjectCreateResponse;
import com.example.neuroforge.dto.UpdateProjectRequest;
import com.example.neuroforge.entity.*;
import com.example.neuroforge.exception.OrganizationNotFoundException;
import com.example.neuroforge.exception.ProjectAlreadyExistException;
import com.example.neuroforge.mapper.ProjectMapper;
import com.example.neuroforge.repository.OrganizationRepository;
import com.example.neuroforge.repository.ProjectRepository;
import com.example.neuroforge.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectMapper projectMapper;
    @Autowired
    private OrganizationRepository organizationRepository;

    @Transactional
    public ProjectCreateResponse createProject(ProjectCreateRequest createRequest) throws BadRequestException {
            String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
            User projectManager = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found "));
            Organization organization = organizationRepository.findById(projectManager.getOrganization().getId()).orElseThrow(
                    () -> new OrganizationNotFoundException("Organization not found"));
            if (projectRepository.existsByTitleAndOrganization(createRequest.title(), organization)){
                throw new ProjectAlreadyExistException("Project already exists");
            }


        if (createRequest.end_date().isBefore(createRequest.start_date())){
            throw new BadRequestException("End date can't be before start date");
        }
        if (createRequest.start_date().isBefore(LocalDate.now())){
            throw new BadRequestException("Start date can't be past");
        }
        Project project = Project.builder()
                .title(createRequest.title())
                .description(createRequest.description())
                .projectStatus(createRequest.projectStatus())
                .start_date(createRequest.start_date())
                .end_date(createRequest.end_date())
                .projectManager(projectManager)
                .organization(organization)
                .build();
            projectRepository.save(project);
            return projectMapper.projectCreateDto(project);
    }

    public void updateProjectStatus(Long id, ProjectStatus projectStatus) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Project targetProject = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));

        if (!projectManager.getOrganization().getId().equals(targetProject.getOrganization().getId())){
            throw new AccessDeniedException("You can't modify status of project from another organization");
        }

        targetProject.setProjectStatus(projectStatus);
        projectRepository.save(targetProject);
    }

    public ProjectCreateResponse getProjectById(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("user not found"));
        Project targetProject = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        if (!user.getOrganization().getId().equals(targetProject.getOrganization().getId())){
            throw new AccessDeniedException("You can't receive project from another organization");
        }

        if (user.getRole() == Role.PROJECT_MANAGER) {

            if (!user.getId().equals(targetProject.getProjectManager().getId())) {
                throw new AccessDeniedException(
                        "You can't receive project created by other Project Manager");
            }
        }
        return projectMapper.projectCreateDto(targetProject);

    }

    public ResponseEntity<List<ProjectCreateResponse>> getAllProjectsOfProjectManager(){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("user not found"));
        Organization organization = organizationRepository.findById(projectManager.getOrganization().getId()).orElseThrow(() ->
                new RuntimeException("Organization not found"));
        List<Project> projects = new ArrayList<>();
        projects = projectRepository.findAllByProjectManagerAndOrganization(projectManager, organization );
        List<ProjectCreateResponse> projectCreateResponses = projects.stream()
                .map( project -> ProjectCreateResponse.builder()
                        .id(project.getId())
                        .title(project.getTitle())
                        .description(project.getDescription())
                        .projectStatus(project.getProjectStatus())
                        .start_date(project.getStart_date())
                        .end_date(project.getEnd_date())
                        .build()
                ).toList();
        return new ResponseEntity<>(projectCreateResponses, HttpStatus.OK);
    }

    public ProjectCreateResponse editProjectInfo(Long id, UpdateProjectRequest createRequest) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Project targetProject = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        if (!projectManager.getOrganization().getId().equals(targetProject.getOrganization().getId())){
            throw new AccessDeniedException("You can't edit project of another organization");
        }
        if (!projectManager.getId().equals(targetProject.getProjectManager().getId())){
            throw new AccessDeniedException("You can't modify another Project Manager project");
        }
        if (createRequest.title() != null) {
            targetProject.setTitle(createRequest.title());
        }
        if (createRequest.description() != null) {
            targetProject.setDescription(createRequest.description());
        }
        if (createRequest.start_date()!= null) {
            targetProject.setStart_date(createRequest.start_date());
        }
        if (createRequest.end_date()!=null) {
            targetProject.setEnd_date(createRequest.end_date());
        }
        projectRepository.save(targetProject);
        return projectMapper.projectCreateDto(targetProject);
    }

    public void deleteProject(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Project targetProject = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        if (!projectManager.getOrganization().getId().equals(targetProject.getOrganization().getId())){
            throw new AccessDeniedException("You can't Delete project of another organization");
        }
        if (!projectManager.getId().equals(targetProject.getProjectManager().getId())){
            throw new AccessDeniedException("You can't Delete another Project Manager project");
        }

        projectRepository.delete(targetProject);
    }
}
