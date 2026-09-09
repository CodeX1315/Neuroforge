package com.example.neuroforge.service;

import com.example.neuroforge.dto.ReportCreateRequest;
import com.example.neuroforge.dto.ReportCreateResponse;
import com.example.neuroforge.dto.ReportUpdateRequest;
import com.example.neuroforge.entity.*;
import com.example.neuroforge.exception.OrganizationNotFoundException;
import com.example.neuroforge.mapper.ReportMapper;
import com.example.neuroforge.repository.OrganizationRepository;
import com.example.neuroforge.repository.ProjectRepository;
import com.example.neuroforge.repository.ReportRepository;
import com.example.neuroforge.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ReportService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private ReportMapper reportMapper;
    @Autowired
    private OrganizationRepository organizationRepository;

    @Transactional
    public ReportCreateResponse createReport(ReportCreateRequest createRequest) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User reportCreator = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Project project = projectRepository.findById(createRequest.projectId()).orElseThrow(()-> new RuntimeException("Project not found"));
        Organization organization = organizationRepository.findById(reportCreator.getOrganization().getId()).orElseThrow(
                () -> new OrganizationNotFoundException("Organization not found")
        );

        if (!reportCreator.getOrganization().getId().equals(project.getOrganization().getId())){
            throw new AccessDeniedException("You can't create report for another organization");
        }

        if (reportRepository.existsByTitleAndProjectAndOrganization(createRequest.title(), project, organization)){
            throw new RuntimeException("Report already exist");
        }

        Report report = Report.builder()
                .title(createRequest.title())
                .reportType(createRequest.reportType())
                .data(createRequest.data())
                .project(project)
                .organization(organization)
                .createdBy(reportCreator)
                .build();
        reportRepository.save(report);
        return reportMapper.repostCreateDto(report);
    }

    public ReportCreateResponse getReportById(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User reportCreator = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Report report = reportRepository.findById(id).orElseThrow(()-> new RuntimeException("Report not found"));

        if (!reportCreator.getOrganization().getId().equals(report.getOrganization().getId())){
            throw new AccessDeniedException("You can't receive report from another organization");
        }

        return reportMapper.repostCreateDto(report);
    }

    public List<ReportCreateResponse> getReportByTypeAndRelatedProject(Long id, ReportType reportType){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User reportCreator = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project Not found"));
        List<Report> reports = new ArrayList<>();
        reports = reportRepository.findAllByReportTypeAndProject(reportType, project);
        return reports.stream()
                .map(report -> ReportCreateResponse.builder()
                        .id(report.getId())
                        .title(report.getTitle())
                        .reportType(report.getReportType())
                        .creatorId(report.getCreatedBy().getId())
                        .data(report.getData())
                        .build()).toList();
    }

    public List<ReportCreateResponse> getReportCreatedByUser(Long id,ReportType reportType){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User reportCreator = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project Not found"));
        List<Report> reports = new ArrayList<>();
        reports = reportRepository.findAllByReportTypeAndProjectAndCreatedBy(reportType, project, reportCreator);
        return reports.stream()
                .map(report -> ReportCreateResponse.builder()
                        .id(report.getId())
                        .title(report.getTitle())
                        .reportType(report.getReportType())
                        .creatorId(report.getCreatedBy().getId())
                        .data(report.getData())
                        .build()).toList();
    }

    public ReportUpdateRequest updateDataOfReport(Long id,ReportUpdateRequest updateRequest) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User reportCreator = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Report report = reportRepository.findById(id).orElseThrow(()-> new RuntimeException("Report not found"));
        if (!reportCreator.getOrganization().getId().equals(report.getOrganization().getId())) {
            throw new AccessDeniedException("You can't modify report of another organization");
        }
        if (updateRequest.data()!=null){
            report.setData(updateRequest.data());
        }

        reportRepository.save(report);
        return ReportUpdateRequest.builder()
                .data(report.getData())
                .build();
    }

    public void deleteReport(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User reportCreator = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
        Report report = reportRepository.findById(id).orElseThrow(()-> new RuntimeException("Report not found"));
        if (!reportCreator.getOrganization().getId().equals(report.getOrganization().getId())){
            throw new AccessDeniedException("You can't remove report of another organization");
        }
        if (!reportCreator.getId().equals(report.getCreatedBy().getId())){
            throw new AccessDeniedException("You can't remove the report created by another user");
        }

        reportRepository.delete(report);
    }
}
