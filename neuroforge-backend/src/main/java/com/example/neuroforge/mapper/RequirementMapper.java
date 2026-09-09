package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.RequirementCreateResponse;
import com.example.neuroforge.entity.Requirement;
import org.mapstruct.Mapper;

@Mapper( componentModel = "spring")
public interface RequirementMapper {
    RequirementCreateResponse requirementResponseDto(Requirement requirement);
}
