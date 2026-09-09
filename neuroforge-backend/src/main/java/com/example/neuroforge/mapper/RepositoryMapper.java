package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.RepositoryCreateResponse;
import com.example.neuroforge.entity.Repository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RepositoryMapper {
    @Mapping(source = "project.id", target = "projectId")
    RepositoryCreateResponse createRepoDto(Repository repository);
}
