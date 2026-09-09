package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.BugCreateResponse;
import com.example.neuroforge.entity.Bug;
import org.mapstruct.Mapper;

@Mapper( componentModel = "spring")
public interface BugMapper {
    BugCreateResponse createBugDto(Bug bug);
}
