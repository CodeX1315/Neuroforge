package com.example.neuroforge.dto;

import com.example.neuroforge.entity.ReportType;

public record ReportCreateRequest(
        Long projectId,
        String title,
        ReportType reportType,
        String data
) {
}
