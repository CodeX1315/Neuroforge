package com.example.neuroforge.dto;

import com.example.neuroforge.entity.TestCaseStatus;
import lombok.Builder;

@Builder
public record UpdateTestCaseStatus(
        Long taskId,
        TestCaseStatus testCaseStatus
) {
}
