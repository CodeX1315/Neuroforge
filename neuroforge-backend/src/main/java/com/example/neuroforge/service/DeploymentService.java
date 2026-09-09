package com.example.neuroforge.service;

import com.example.neuroforge.dto.DeploymentCreateRequest;
import com.example.neuroforge.dto.DeploymentResponse;
import com.example.neuroforge.dto.UpdateDeploymentStatus;
import com.example.neuroforge.entity.*;
import com.example.neuroforge.mapper.DeploymentMapper;
import com.example.neuroforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class DeploymentService {

    @Autowired
    private DeploymentRepository deploymentRepository;
    @Autowired
    private ReleaseRepository releaseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DeploymentMapper deploymentMapper;

    public DeploymentResponse createDeployment(DeploymentCreateRequest request) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User loggedUser = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Release release = releaseRepository.findById(request.releaseId()).orElseThrow(() -> new RuntimeException("Release not found"));

        User devopsEngineer = userRepository.findById(request.devopsEngineerId()).orElseThrow(() -> new RuntimeException("DevOps engineer not found"));

        if (!Objects.equals(loggedUser.getOrganization().getId(), release.getOrganization().getId())) {
            throw new AccessDeniedException("You cannot deploy another organization's release");
        }

        if (!Objects.equals(devopsEngineer.getOrganization().getId(), release.getOrganization().getId())) {
            throw new AccessDeniedException("DevOps engineer does not belong to this organization");
        }

        Deployment deployment = Deployment.builder()
                .release(release)
                .devopsEngineer(devopsEngineer)
                .organization(release.getOrganization())
                .environment(request.environment())
                .deploymentStatus(DeploymentStatus.PENDING)
                .deployAt(LocalDate.now())
                .build();

        Deployment savedDeployment = deploymentRepository.save(deployment);

        return deploymentMapper.toResponse(savedDeployment);
    }

    public List<DeploymentResponse> getDeploymentsByRelease(Long releaseId) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Release release = releaseRepository.findById(releaseId).orElseThrow(() -> new RuntimeException("Release not found"));

        if (!Objects.equals(user.getOrganization().getId(), release.getOrganization().getId())) {
            throw new AccessDeniedException("You cannot access another organization's release");
        }

        return deploymentRepository.findByReleaseId(releaseId)
                .stream()
                .map(deploymentMapper::toResponse)
                .toList();
    }

    public DeploymentResponse getDeployment(Long deploymentId) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Deployment deployment = deploymentRepository.findById(deploymentId).orElseThrow(() -> new RuntimeException("Deployment not found"));

        if (!Objects.equals(user.getOrganization().getId(), deployment.getOrganization().getId())) {
            throw new AccessDeniedException("You cannot access another organization's deployment");
        }

        return deploymentMapper.toResponse(deployment);
    }

    public DeploymentResponse updateDeploymentStatus(Long deploymentId, UpdateDeploymentStatus request) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(
                                        "User not found"));
        Deployment deployment = deploymentRepository.findById(deploymentId).orElseThrow(() -> new RuntimeException(
                                        "Deployment not found"));

        if (!deployment.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new AccessDeniedException(
                    "Deployment belongs to another organization");
        }

        deployment.setDeploymentStatus(request.deploymentStatus());

        deploymentRepository.save(deployment);

        return deploymentMapper.toResponse(deployment);
    }

    public void deleteDeployment(Long deploymentId) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(
                                        "User not found"));

        Deployment deployment = deploymentRepository.findById(deploymentId).orElseThrow(() ->
                                new RuntimeException(
                                        "Deployment not found"));

        if (!deployment.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new AccessDeniedException(
                    "Deployment belongs to another organization");
        }

        deploymentRepository.delete(deployment);
    }
}