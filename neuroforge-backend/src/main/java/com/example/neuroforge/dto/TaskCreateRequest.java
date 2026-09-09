package com.example.neuroforge.dto;

import com.example.neuroforge.entity.TaskPriority;
import com.example.neuroforge.entity.TaskStatus;

public record TaskCreateRequest(
        Long sprintId,
        Long requirementId,
        Long assignedDeveloperId,
        String title,
        String description,
        Integer estimatedHours,
        TaskStatus taskStatus,
        TaskPriority taskPriority

) {
}
