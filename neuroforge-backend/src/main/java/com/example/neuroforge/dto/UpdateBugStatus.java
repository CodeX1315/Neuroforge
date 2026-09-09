package com.example.neuroforge.dto;

import com.example.neuroforge.entity.BugStatus;
import lombok.Builder;

@Builder
public record UpdateBugStatus(
        BugStatus bugStatus
) {
}
