package com.example.neuroforge.dto;

import lombok.Builder;

@Builder
public record UpdateTestCaseStepAndExpectedResult(
        Long taskId,
        String steps,
        String expectedResult
) {
}
