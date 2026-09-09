package com.example.neuroforge.service;

import com.example.neuroforge.dto.SprintCreateRequest;
import com.example.neuroforge.dto.SprintCreateResponse;
import com.example.neuroforge.dto.SprintUpdateRequest;
import com.example.neuroforge.dto.SprintUpdateResponse;
import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Project;
import com.example.neuroforge.entity.Sprint;
import com.example.neuroforge.entity.User;
import com.example.neuroforge.exception.OrganizationNotFoundException;
import com.example.neuroforge.mapper.SprintMapper;
import com.example.neuroforge.repository.OrganizationRepository;
import com.example.neuroforge.repository.ProjectRepository;
import com.example.neuroforge.repository.SprintRepository;
import com.example.neuroforge.repository.UserRepository;
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
public class SprintService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SprintRepository sprintRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private SprintMapper sprintMapper;

    public SprintCreateResponse createSprint(SprintCreateRequest createRequest) throws AccessDeniedException, ReflectiveOperationException, BadRequestException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Project project = projectRepository.findById(createRequest.projectId()).orElseThrow(()-> new RuntimeException("Project not found"));
        Organization organization = organizationRepository.findById(projectManager.getOrganization().getId()).orElseThrow(
                () -> new OrganizationNotFoundException("Organization not found"));
        if (!project.getOrganization().getId().equals(projectManager.getOrganization().getId())){
            throw new AccessDeniedException("You can't create Sprint for another organization project");
        }

        if (sprintRepository.existsByNameAndProjectAndOrganization(createRequest.name(), project, organization)){
            throw new ReflectiveOperationException("Sprint already exists");
        }

        if (createRequest.end_date().isBefore(createRequest.start_date())){
            throw new BadRequestException("End date can't be before start date");
        }
        if (createRequest.start_date().isBefore(LocalDate.now())){
            throw new BadRequestException("Start date can't be past");
        }

        Sprint sprint = Sprint.builder()
                .name(createRequest.name())
                .project(project)
                .organization(organization)
                .start_date(createRequest.start_date())
                .end_date(createRequest.end_date())
                .goal(createRequest.goal())
                .projectManager(projectManager)
                .build();

        sprintRepository.save(sprint);
        return sprintMapper.sprintCreateDto(sprint);
    }

    public SprintCreateResponse getSprintById(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("user not found"));
        Sprint targetSprint = sprintRepository.findById(id).orElseThrow(() -> new RuntimeException("Sprint not exist"));
        if (!projectManager.getOrganization().getId().equals(targetSprint.getOrganization().getId())){
            throw new AccessDeniedException("You can't receive another organization's project Sprints");
        }
        if (!projectManager.getId().equals(targetSprint.getProjectManager().getId())){
            throw new AccessDeniedException("You can't receive sprint create by another project manager");
        }
        return sprintMapper.sprintCreateDto(targetSprint);
    }

    public ResponseEntity<List<SprintCreateResponse>> getAllSprintsRelatedProject(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("user not found"));
        Project targetProject = projectRepository.findById(id).orElseThrow(()-> new RuntimeException("Project not found"));
        if (!projectManager.getOrganization().getId().equals(targetProject.getOrganization().getId())){
            throw new AccessDeniedException("You can't receive another organization's project Sprints");
        }
        List<Sprint> sprints = new ArrayList<>();
        sprints = sprintRepository.findAllByProjectManagerAndProject(projectManager, targetProject);
        List<SprintCreateResponse> responses = sprints.stream()
                .map( sprint -> SprintCreateResponse.builder()
                        .id(sprint.getId())
                        .name(sprint.getName())
                        .start_date(sprint.getStart_date())
                        .end_date(sprint.getEnd_date())
                        .goal(sprint.getGoal())
                        .build()).toList();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    public SprintUpdateResponse updateSprint(Long id, SprintUpdateRequest updateRequest) throws AccessDeniedException, BadRequestException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Sprint targetSprint = sprintRepository.findById(id).orElseThrow(() -> new RuntimeException("Sprint not exist"));
        if (!projectManager.getId().equals(targetSprint.getProjectManager().getId())){
            throw new AccessDeniedException("You can't modify sprint that created by another Project Manager");
        }

        LocalDate startDate = updateRequest.start_date() != null
                ? updateRequest.start_date()
                : targetSprint.getStart_date();

        LocalDate endDate = updateRequest.end_date() != null
                ? updateRequest.end_date()
                : targetSprint.getEnd_date();

        // Date validation
        if (endDate.isBefore(startDate)) {
            throw new BadRequestException(
                    "End date can't be before start date"
            );
        }

        if (startDate.isBefore(LocalDate.now())) {
            throw new BadRequestException(
                    "Start date can't be past"
            );
        }

        if (!projectManager.getOrganization().getId().equals(targetSprint.getOrganization().getId())){
            throw new AccessDeniedException("You can't modify sprint of other organization");
        }

        if (updateRequest.name()!=null){
            targetSprint.setName(updateRequest.name());
        }

        targetSprint.setStart_date(startDate);
        targetSprint.setEnd_date(endDate);

        if (updateRequest.goal()!=null){
            targetSprint.setGoal(updateRequest.goal());
        }

        sprintRepository.save(targetSprint);
        return SprintUpdateResponse.builder()
                .id(targetSprint.getId())
                .name(targetSprint.getName())
                .start_date(targetSprint.getStart_date())
                .end_date(targetSprint.getEnd_date())
                .goal(targetSprint.getGoal())
                .build();
    }

    public void deleteSprint(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User projectManager = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("user not found"));
        Sprint targetSprint = sprintRepository.findById(id).orElseThrow(() -> new RuntimeException("Sprint not exist"));
        if (!projectManager.getOrganization().getId().equals(targetSprint.getOrganization().getId())){
            throw new AccessDeniedException("You can't delete another organization's project Sprints");
        }
        if (!projectManager.getId().equals(targetSprint.getProjectManager().getId())){
            throw new AccessDeniedException("You can't delete sprint created by another project manager");
        }
        sprintRepository.delete(targetSprint);
    }
}
