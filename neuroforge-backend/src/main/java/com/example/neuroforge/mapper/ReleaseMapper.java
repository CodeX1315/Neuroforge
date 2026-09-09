package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.ReleaseResponse;
import com.example.neuroforge.entity.Release;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper( componentModel ="spring")
public interface ReleaseMapper {
    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "sprint.id", target = "sprintId")
    @Mapping(source = "repo.id", target = "repositoryId")
    ReleaseResponse toResponse(Release release);
}
