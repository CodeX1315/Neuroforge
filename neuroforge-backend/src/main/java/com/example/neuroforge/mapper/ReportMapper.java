package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.ReportCreateResponse;
import com.example.neuroforge.entity.Report;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReportMapper {
    @Mapping(target = "creatorId", source = "createdBy.id")
    ReportCreateResponse repostCreateDto(Report report);
}
