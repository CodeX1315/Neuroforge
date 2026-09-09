package com.example.neuroforge.dto;

import com.example.neuroforge.entity.TaskPriority;
import lombok.Builder;

@Builder
public record UpdateTaskPriority(
        TaskPriority taskPriority
) {
}
