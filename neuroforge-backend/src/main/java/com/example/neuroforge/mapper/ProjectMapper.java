package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.ProjectCreateResponse;
import com.example.neuroforge.entity.Project;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    ProjectCreateResponse projectCreateDto(Project project);
}
