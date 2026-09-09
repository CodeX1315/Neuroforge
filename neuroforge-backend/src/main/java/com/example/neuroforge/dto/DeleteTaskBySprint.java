package com.example.neuroforge.dto;

public record DeleteTaskBySprint(
        Long taskId,
        Long sprintId
) {
}
