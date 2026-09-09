package com.example.neuroforge.dto;

import com.example.neuroforge.entity.TaskStatus;
import lombok.Builder;

@Builder
public record UpdateTaskStatus(
        TaskStatus taskStatus
) {
}
