package com.example.neuroforge.service;

import com.example.neuroforge.dto.ReleaseCreateRequest;
import com.example.neuroforge.dto.ReleaseResponse;
import com.example.neuroforge.dto.UpdateChangeLog;
import com.example.neuroforge.dto.UpdateReleaseStatus;
import com.example.neuroforge.entity.*;
import com.example.neuroforge.mapper.ReleaseMapper;
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
public class ReleaseService {

    @Autowired
    private  ReleaseRepository releaseRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private SprintRepository sprintRepository;
    @Autowired
    private RepositoryRepository repositoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReleaseMapper releaseMapper;

    public ReleaseResponse createRelease(ReleaseCreateRequest request) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(request.projectId()).orElseThrow(() -> new RuntimeException("Project not found"));

        Sprint sprint = sprintRepository.findById(request.sprintId()).orElseThrow(() -> new RuntimeException("Sprint not found"));

        Repository repository = repositoryRepository.findById(request.repositoryId()).orElseThrow(() -> new RuntimeException("Repository not found"));

        if (!Objects.equals(user.getOrganization().getId(), project.getOrganization().getId())) {
            throw new AccessDeniedException(
                    "You cannot access another organization's project");
        }

        if (!Objects.equals(sprint.getProject().getId(), project.getId())) {
            throw new RuntimeException(
                    "Sprint does not belong to this project");
        }

        if (!Objects.equals(repository.getProject().getId(),project.getId())) {
            throw new RuntimeException(
                    "Repository does not belong to this project");
        }

        if (releaseRepository.existsByVersionAndRepoId(request.version(), repository.getId())) {
            throw new RuntimeException(
                    "Release version already exists for this repository");
        }

        Release release = Release.builder()
                .project(project)
                .sprint(sprint)
                .repo(repository)
                .organization(project.getOrganization())
                .version(request.version())
                .releaseStatus(ReleaseStatus.DRAFT)
                .releaseDate(LocalDate.now())
                .changelog(request.changelog())
                .build();

        Release savedRelease = releaseRepository.save(release);

        return releaseMapper.toResponse(savedRelease);
    }

    public List<ReleaseResponse> getReleasesByProject(Long projectId) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                        new RuntimeException("User not found"));

        Project project = projectRepository.findById(projectId).orElseThrow(() ->new RuntimeException("Project not found"));

        if (!Objects.equals(user.getOrganization().getId(), project.getOrganization().getId())) {
            throw new AccessDeniedException(
                    "You cannot access another organization's project");
        }

        return releaseRepository.findByProjectId(projectId)
                .stream()
                .map(releaseMapper::toResponse)
                .toList();
    }

    public ReleaseResponse getRelease(Long releaseId) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Release release = releaseRepository.findById(releaseId).orElseThrow(() -> new RuntimeException("Release not found"));

        if (!Objects.equals(user.getOrganization().getId(), release.getOrganization().getId())) {
            throw new AccessDeniedException(
                    "You cannot access another organization's release");
        }

        return releaseMapper.toResponse(release);
    }

    public List<ReleaseResponse> getReleaseByRepository(Long repositoryId) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(() -> new RuntimeException(
                                        "Repository not found"));

        if (!repository.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new AccessDeniedException("Repository belongs to another organization");
        }

        List<Release> releases = releaseRepository.findByRepo(repository);

        return releases.stream()
                .map(releaseMapper::toResponse)
                .toList();
    }

    public ReleaseResponse updateReleaseStatus(Long releaseId, UpdateReleaseStatus request) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(
                                        "User not found"));

        Release release = releaseRepository.findById(releaseId).orElseThrow(() -> new RuntimeException(
                                        "Release not found"));

        if (!release.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new AccessDeniedException("Release belongs to another organization");
        }

        release.setReleaseStatus(request.releaseStatus());

        releaseRepository.save(release);

        return releaseMapper.toResponse(release);
    }

    public ReleaseResponse updateChangeLog(Long releaseId, UpdateChangeLog request) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(
                                        "User not found"));

        Release release = releaseRepository.findById(releaseId).orElseThrow(() -> new RuntimeException(
                                        "Release not found"));

        if (!release.getOrganization().getId().equals(user.getOrganization().getId())) {throw new AccessDeniedException(
                    "Release belongs to another organization");
        }

        if (request.changelog() != null) {
            release.setChangelog(request.changelog());
        }

        releaseRepository.save(release);

        return releaseMapper.toResponse(release);
    }

    public void deleteRelease(Long releaseId) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(
                                        "User not found"));
        Release release = releaseRepository.findById(releaseId).orElseThrow(() -> new RuntimeException(
                                        "Release not found"));
        if (!release.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new AccessDeniedException(
                    "Release belongs to another organization");
        }
        if (!release.getDeployments().isEmpty()) {
            throw new RuntimeException(
                    "Cannot delete release that has deployments");
        }
        releaseRepository.delete(release);
    }
}
