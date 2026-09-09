package com.example.neuroforge.dto;

import com.example.neuroforge.entity.TestCaseStatus;
import lombok.Builder;

@Builder
public record TestCaseCreateResponse(
        Long id,
        Long taskId,
        String title,
        String steps,
        String expectedResult,
        TestCaseStatus testCaseStatus
) {
}
