package com.example.neuroforge.dto;

import com.example.neuroforge.entity.ReportType;

public record ReportByReportTypeRequest(
        ReportType reportType
) {
}
