package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.WorkspaceResponse;
import com.example.neuroforge.entity.Organization;
import org.mapstruct.Mapper;

@Mapper( componentModel = "spring")
public interface OrganizationMapper {
    WorkspaceResponse toWorkspaceResponseDto(Organization organization);
}
