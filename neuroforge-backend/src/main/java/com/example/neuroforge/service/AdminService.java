package com.example.neuroforge.service;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.entity.*;
import com.example.neuroforge.exception.LastAdminDeletionException;
import com.example.neuroforge.mapper.*;
import com.example.neuroforge.repository.*;
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
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectMapper projectMapper;
    @Autowired
    private RequirementRepository requirementRepository;
    @Autowired
    private RequirementMapper requirementMapper;
    @Autowired
    private SprintRepository sprintRepository;
    @Autowired
    private SprintMapper sprintMapper;
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private ReportMapper reportMapper;
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private DocumentMapper documentMapper;
    @Autowired
    private RepositoryRepository repositoryRepository;
    @Autowired
    private RepositoryMapper repositoryMapper;
    @Autowired
    private ReleaseRepository releaseRepository;
    @Autowired
    private ReleaseMapper releaseMapper;
    @Autowired
    private DeploymentRepository deploymentRepository;
    @Autowired
    private DeploymentMapper deploymentMapper;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TaskMapper taskMapper;
    @Autowired
    private TestCaseRepository testCaseRepository;
    @Autowired
    private TestCaseMapper testCaseMapper;
    @Autowired
    private BugRepository bugRepository;
    @Autowired
    private BugMapper bugMapper;

    public ResponseEntity<List<AllUsersResponse>> allUsersList(){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User admin = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
        List<User> userList = new ArrayList<>();
        userList = userRepository.findByOrganizationId(admin.getOrganization().getId());
        List<AllUsersResponse> responses = userList.stream()
                .map( user -> AllUsersResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole()).build()
                ).toList();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    public void updateRole(Long id, Role role) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User admin = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
        User targetedUser = userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!admin.getOrganization().getId().equals(targetedUser.getOrganization().getId())){
            throw new AccessDeniedException("You can't modify user's from another organization");
        }

        if (targetedUser.getRole() == Role.ADMIN) {

            long adminCount = userRepository
                    .countByOrganizationAndRole(
                            targetedUser.getOrganization(),
                            Role.ADMIN
                    );

            if (adminCount <= 1) {
                throw new LastAdminDeletionException(
                        "You are the only administrator in this organization. "
                );
            }
        }

        targetedUser.setRole(role);
        userRepository.save(targetedUser);
    }

    public void deleteUser(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User admin = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
        User targetedUser = userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!admin.getOrganization().getId().equals(targetedUser.getOrganization().getId())){
            throw new AccessDeniedException("You can't Delete user's from another organization");
        }


        if (targetedUser.getRole() == Role.ADMIN) {

            long adminCount = userRepository
                    .countByOrganizationAndRole(
                            targetedUser.getOrganization(),
                            Role.ADMIN
                    );

            if (adminCount <= 1) {
                throw new LastAdminDeletionException(
                        "You are the only administrator in this organization. "
                );
            }
        }

        userRepository.delete(targetedUser);
    }

    public ResponseEntity<List<ProjectCreateResponse>> getAllProjects() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Project> projects =
                projectRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                projects.stream()
                        .map(projectMapper::projectCreateDto)
                        .toList()
        );
    }

    public ResponseEntity<List<RequirementCreateResponse>> getAllRequirements() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Requirement> requirements =
                requirementRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                requirements.stream()
                        .map(requirementMapper::requirementResponseDto)
                        .toList()
        );
    }

    public ResponseEntity<List<SprintCreateResponse>> getAllSprints() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Sprint> sprints=
                sprintRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                sprints.stream()
                        .map(sprintMapper::sprintCreateDto)
                        .toList()
        );
    }

    public ResponseEntity<List<ReportCreateResponse>> getAllReports() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Report> reports=
                reportRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                reports.stream()
                        .map(reportMapper::repostCreateDto)
                        .toList()
        );
    }

    public ResponseEntity<List<DocumentCreateResponse>> getAllDocuments() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Document> documents=
                documentRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                documents.stream()
                        .map(documentMapper::documentCreateDto)
                        .toList()
        );
    }

    public ResponseEntity<List<RepositoryCreateResponse>> getAllRepositories() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Repository> repositories=
                repositoryRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                repositories.stream()
                        .map(repositoryMapper::createRepoDto)
                        .toList()
        );
    }

    public ResponseEntity<List<ReleaseResponse>> getAllReleases() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Release> releases=
                releaseRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                releases.stream()
                        .map(releaseMapper::toResponse)
                        .toList()
        );
    }

    public ResponseEntity<List<DeploymentResponse>> getAllDeployments() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Deployment> deployments=
                deploymentRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                deployments.stream()
                        .map(deploymentMapper::toResponse)
                        .toList()
        );
    }

    public ResponseEntity<List<TaskCreateResponse>> getAllTasks() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Task> tasks=
                taskRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                tasks.stream()
                        .map(taskMapper::taskCreateDto)
                        .toList()
        );
    }

    public ResponseEntity<List<TestCaseCreateResponse>> getAllTestCases() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<TestCase> testCases=
                testCaseRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                testCases.stream()
                        .map(testCaseMapper::testCaseCreateDto)
                        .toList()
        );
    }

    public ResponseEntity<List<BugCreateResponse>> getAllBugs() {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Bug> bugs=
                bugRepository.findAllByOrganization(admin.getOrganization());

        return ResponseEntity.ok(
                bugs.stream()
                        .map(bugMapper::createBugDto)
                        .toList()
        );
    }





}
