package com.example.neuroforge.dto;

import com.example.neuroforge.entity.BugSeverity;
import com.example.neuroforge.entity.BugStatus;

public record BugCreateRequest(
        Long testCaseId,
        Long taskId,
        String title,
        String description,
        BugSeverity bugSeverity,
        BugStatus bugStatus
) {
}
