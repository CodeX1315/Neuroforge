package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.TaskCreateResponse;
import com.example.neuroforge.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper( componentModel = "spring")
public interface TaskMapper {
    @Mapping(source = "assignedDeveloper.id",target = "assignedDeveloperId")
    TaskCreateResponse taskCreateDto(Task task);
}
