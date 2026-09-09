package com.example.neuroforge.service;

import com.example.neuroforge.dto.RequirementCreateRequest;
import com.example.neuroforge.dto.RequirementCreateResponse;
import com.example.neuroforge.dto.UpdateRequirementRequest;
import com.example.neuroforge.entity.*;
import com.example.neuroforge.exception.OrganizationNotFoundException;
import com.example.neuroforge.mapper.RequirementMapper;
import com.example.neuroforge.repository.OrganizationRepository;
import com.example.neuroforge.repository.ProjectRepository;
import com.example.neuroforge.repository.RequirementRepository;
import com.example.neuroforge.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class RequirementService {
    @Autowired
    private RequirementRepository requirementRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private RequirementMapper requirementMapper;

    @Transactional
    public RequirementCreateResponse createRequirement(RequirementCreateRequest createRequest) throws AccessDeniedException, ReflectiveOperationException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User businessAnalyst = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Project project = projectRepository.findById(createRequest.projectId()).orElseThrow(() -> new RuntimeException("Project not found"));
        Organization organization = organizationRepository.findById(businessAnalyst.getOrganization().getId()).orElseThrow(()-> new OrganizationNotFoundException("Organization not found"));
        if (!project.getOrganization().getId().equals(businessAnalyst.getOrganization().getId())){
            throw new AccessDeniedException("You can't create requirement in another organization project");
        }

        if (requirementRepository.existsByTitleAndProjectAndOrganization(createRequest.title(), project, organization)){
            throw new ReflectiveOperationException("Requirement already exist for this project");
        }

        Requirement requirement = Requirement.builder()
                .title(createRequest.title())
                .description(createRequest.description())
                .requirementPriority(createRequest.requirementPriority())
                .requirementStatus(createRequest.requirementStatus())
                .project(project)
                .organization(organization)
                .businessAnalyst(businessAnalyst)
                .build();
        requirementRepository.save(requirement);
        return requirementMapper.requirementResponseDto(requirement);

    }

    public RequirementCreateResponse getRequirementById(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User businessAnalyst = userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("User not found"));
        Requirement targetRequirement = requirementRepository.findById(id).orElseThrow( () -> new RuntimeException("Requirement not found"));
        if (!businessAnalyst.getOrganization().getId().equals(targetRequirement.getOrganization().getId())){
            throw new AccessDeniedException("You can't receive requirement of another organization");
        }
        if (!businessAnalyst.getId().equals(targetRequirement.getBusinessAnalyst().getId())){
            throw new AccessDeniedException("You can't receive requirement created by another BA");
        }
        return requirementMapper.requirementResponseDto(targetRequirement);
    }

    public ResponseEntity<List<RequirementCreateResponse>> getAllRequirement(){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User businessAnalyst = userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("User not found"));
        List<Requirement> responses = new ArrayList<>();
        responses = requirementRepository.findAllByBusinessAnalyst(businessAnalyst);
        List<RequirementCreateResponse> allRequirements = responses.stream()
                .map( requirement -> RequirementCreateResponse.builder()
                        .id(requirement.getId())
                        .title(requirement.getTitle())
                        .description(requirement.getDescription())
                        .requirementStatus(requirement.getRequirementStatus())
                        .requirementPriority(requirement.getRequirementPriority())
                        .build()).toList();
        return new ResponseEntity<>(allRequirements, HttpStatus.OK);
    }

    public ResponseEntity<List<RequirementCreateResponse>> getAllRequirementCreatedByBusinessAnalyst(Long projectId){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User businessAnalyst = userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("User not found"));
        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new RuntimeException("Project not found"));
        List<Requirement> responses = new ArrayList<>();
        responses = requirementRepository.findAllByBusinessAnalystAndProject(businessAnalyst, project);
        List<RequirementCreateResponse> allRequirements = responses.stream()
                .map( requirement -> RequirementCreateResponse.builder()
                        .id(requirement.getId())
                        .title(requirement.getTitle())
                        .description(requirement.getDescription())
                        .requirementStatus(requirement.getRequirementStatus())
                        .requirementPriority(requirement.getRequirementPriority())
                        .build()).toList();
        return new ResponseEntity<>(allRequirements, HttpStatus.OK);
    }

    public void updateStatus(Long id, RequirementStatus requirementStatus) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User businessAnalyst = userRepository.findByEmail(email).orElseThrow( () -> new UsernameNotFoundException("User not found"));
        Requirement targetRequirement = requirementRepository.findById(id).orElseThrow( () -> new RuntimeException("Requirement not found"));

        if (!businessAnalyst.getOrganization().getId().equals(targetRequirement.getOrganization().getId())){
            throw new AccessDeniedException("You can't modify requirement of other organizations");
        }

        if (!businessAnalyst.getId().equals(targetRequirement.getBusinessAnalyst().getId())){
            throw new AccessDeniedException("You can't modify requirement that create by other BA");
        }

        targetRequirement.setRequirementStatus(requirementStatus);
        requirementRepository.save(targetRequirement);
    }

    public RequirementCreateResponse editRequirementInfo(Long id,UpdateRequirementRequest updateRequirementRequest) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User businessAnalyst = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Requirement targetRequirement = requirementRepository.findById(id).orElseThrow(() -> new RuntimeException("Requirement not found"));

        if (!businessAnalyst.getOrganization().getId().equals(targetRequirement.getOrganization().getId())){
            throw new AccessDeniedException("You can't modify the requirement of other organization");
        }

        if (!businessAnalyst.getId().equals(targetRequirement.getBusinessAnalyst().getId())){
            throw new AccessDeniedException("You can't modify requirement that create by other BA");
        }

        if (updateRequirementRequest.title() != null){
            targetRequirement.setTitle(updateRequirementRequest.title());
        }

        if (updateRequirementRequest.description() != null){
            targetRequirement.setDescription(updateRequirementRequest.description());
        }

        requirementRepository.save(targetRequirement);
        return requirementMapper.requirementResponseDto(targetRequirement);
    }

    public void deleteRequirement(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User businessAnalyst = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Requirement targetRequirement = requirementRepository.findById(id).orElseThrow(() -> new RuntimeException("Requirement not found"));

        if (!businessAnalyst.getOrganization().getId().equals(targetRequirement.getOrganization().getId())){
            throw new AccessDeniedException("You can't Delete the requirement of other organization");
        }

        if (!businessAnalyst.getId().equals(targetRequirement.getBusinessAnalyst().getId())){
            throw new AccessDeniedException("You can't Delete requirement that create by other BA");
        }

        requirementRepository.delete(targetRequirement);
    }
}
