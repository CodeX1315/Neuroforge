package com.example.neuroforge.controller;

import com.example.neuroforge.dto.ReportByReportTypeRequest;
import com.example.neuroforge.dto.ReportCreateRequest;
import com.example.neuroforge.dto.ReportCreateResponse;
import com.example.neuroforge.dto.ReportUpdateRequest;
import com.example.neuroforge.entity.Report;
import com.example.neuroforge.entity.ReportType;
import com.example.neuroforge.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/create")
    public ResponseEntity<ReportCreateResponse> createReport(@RequestBody ReportCreateRequest createRequest) throws AccessDeniedException {
        ReportCreateResponse response = reportService.createReport(createRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ReportCreateResponse> getReportById(@PathVariable Long id) throws AccessDeniedException {
        ReportCreateResponse response =reportService.getReportById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ReportCreateResponse>> getAllReportsByTypeAndProject(@RequestParam Long projectId, @RequestParam ReportType type){
        List<ReportCreateResponse> response = reportService.getReportByTypeAndRelatedProject(projectId, type);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get-all/creator")
    public ResponseEntity<List<ReportCreateResponse>> getAllReportsCreatedByUser(@RequestParam Long projectId, @RequestParam ReportType type){
        List<ReportCreateResponse> response = reportService.getReportCreatedByUser(projectId, type);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update/{reportId}")
    public ResponseEntity<ReportUpdateRequest> updateReport(@PathVariable Long reportId,@RequestBody ReportUpdateRequest updateRequest) throws AccessDeniedException {
        ReportUpdateRequest response = reportService.updateDataOfReport(reportId,updateRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{reportId}")
    public ResponseEntity<String> deleteReport(@PathVariable Long reportId) throws AccessDeniedException {
        reportService.deleteReport(reportId);
        return new ResponseEntity<>("Report deleted successfully", HttpStatus.OK);
    }

}
