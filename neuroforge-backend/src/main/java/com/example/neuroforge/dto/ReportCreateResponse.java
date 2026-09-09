package com.example.neuroforge.dto;

import com.example.neuroforge.entity.ReportType;
import lombok.Builder;

@Builder
public record ReportCreateResponse(
        Long id,
        String title,
        ReportType reportType,
        Long creatorId,
        String data
) { }
