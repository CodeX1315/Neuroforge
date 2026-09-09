package com.example.neuroforge.dto;

import com.example.neuroforge.entity.BugSeverity;
import lombok.Builder;

@Builder
public record UpdateBugSeverity(
        BugSeverity bugSeverity
) {
}
