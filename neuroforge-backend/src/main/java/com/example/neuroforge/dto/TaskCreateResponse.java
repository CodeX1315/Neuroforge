package com.example.neuroforge.dto;

import com.example.neuroforge.entity.TaskPriority;
import com.example.neuroforge.entity.TaskStatus;
import lombok.Builder;

@Builder
public record TaskCreateResponse(
         Long id,
         Long assignedDeveloperId,
         String title,
         String description,
         Integer estimatedHours,
         TaskStatus taskStatus,
         TaskPriority taskPriority
) {
}
