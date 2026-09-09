package com.example.neuroforge.dto;

import com.example.neuroforge.entity.BugSeverity;
import com.example.neuroforge.entity.BugStatus;
import lombok.Builder;

@Builder
public record BugCreateResponse(
        Long id,
        String title,
        String description,
        BugStatus bugStatus,
        BugSeverity bugSeverity
) {
}
