package com.example.neuroforge.repository;

import com.example.neuroforge.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    boolean existsByTitleAndProjectAndOrganization(String title, Project project, Organization organization);

    List<Report> findAllByReportTypeAndProject(ReportType reportType, Project project);
    List<Report> findAllByReportTypeAndProjectAndCreatedBy(ReportType reportType, Project project, User user);
    List<Report> findAllByOrganization(Organization organization);
}
