package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.SprintCreateResponse;
import com.example.neuroforge.entity.Sprint;
import org.mapstruct.Mapper;

@Mapper( componentModel = "spring")
public interface SprintMapper {
    SprintCreateResponse sprintCreateDto(Sprint sprint);
}
