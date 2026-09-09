package com.example.neuroforge.service;

import com.example.neuroforge.dto.RepositoryCreateRequest;
import com.example.neuroforge.dto.RepositoryCreateResponse;
import com.example.neuroforge.entity.Project;
import com.example.neuroforge.entity.Repository;
import com.example.neuroforge.entity.User;
import com.example.neuroforge.mapper.RepositoryMapper;
import com.example.neuroforge.repository.ProjectRepository;
import com.example.neuroforge.repository.RepositoryRepository;
import com.example.neuroforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class RepositoryService {

    @Autowired
    private RepositoryRepository repositoryRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RepositoryMapper repositoryMapper;

    public RepositoryCreateResponse createRepository(RepositoryCreateRequest request) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(request.projectId()).orElseThrow(() -> new RuntimeException("Project not found"));

        if (!Objects.equals(user.getOrganization().getId(), project.getOrganization().getId())) {
            throw new AccessDeniedException("You cannot access another organization's project");
        }

        if (repositoryRepository.existsByGitHubRepoId(request.gitHubRepoId())) {
            throw new RuntimeException("Repository already exists");
        }

        Repository repository = Repository.builder()
                .project(project)
                .organization(project.getOrganization())
                .gitHubRepoId(request.gitHubRepoId())
                .repositoryName(request.repositoryName())
                .url(request.url())
                .defaultBranch(request.defaultBranch())
                .createdAt(LocalDate.now())
                .build();

        Repository savedRepository = repositoryRepository.save(repository);

        return repositoryMapper.createRepoDto(savedRepository);
    }

    public List<RepositoryCreateResponse> getRepositoriesByProject(Long projectId) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        if (!Objects.equals(user.getOrganization().getId(), project.getOrganization().getId())) {
            throw new AccessDeniedException("You cannot access another organization's project");
        }

        return repositoryRepository
                .findByProjectId(projectId)
                .stream()
                .map(repositoryMapper::createRepoDto)
                .toList();
    }

    public RepositoryCreateResponse getRepository(Long repositoryId) throws AccessDeniedException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(() -> new RuntimeException("Repository not found"));

        if (!Objects.equals(user.getOrganization().getId(), repository.getOrganization().getId())) {
            throw new AccessDeniedException("You cannot access another organization's repository");
        }

        return repositoryMapper.createRepoDto(repository);
    }
}
