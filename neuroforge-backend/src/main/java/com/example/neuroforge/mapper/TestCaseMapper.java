package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.TestCaseCreateResponse;
import com.example.neuroforge.entity.TestCase;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TestCaseMapper {
    @Mapping(source = "task.id", target = "taskId")
    TestCaseCreateResponse testCaseCreateDto(TestCase testCase);
}
