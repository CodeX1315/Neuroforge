package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.DeploymentResponse;
import com.example.neuroforge.entity.Deployment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper( componentModel = "spring")
public interface DeploymentMapper {
    @Mapping(source = "release.id", target = "releaseId")
    @Mapping(source = "devopsEngineer.id", target = "devopsEngineerId")
    DeploymentResponse toResponse(Deployment deployment);
}
