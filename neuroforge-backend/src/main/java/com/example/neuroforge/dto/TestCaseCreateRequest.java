package com.example.neuroforge.dto;

import com.example.neuroforge.entity.TestCaseStatus;

public record TestCaseCreateRequest(
        Long taskId,
        String title,
        String steps,
        String expectedResult,
        TestCaseStatus testCaseStatus
) {
}
