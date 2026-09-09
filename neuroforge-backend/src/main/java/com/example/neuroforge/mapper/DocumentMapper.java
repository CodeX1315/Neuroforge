package com.example.neuroforge.mapper;

import com.example.neuroforge.dto.DocumentCreateResponse;
import com.example.neuroforge.entity.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper( componentModel = "spring")
public interface DocumentMapper {
    @Mapping(source = "createdBy.id", target = "creatorId")
    DocumentCreateResponse documentCreateDto(Document document);
}
