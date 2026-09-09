package com.example.neuroforge.dto;

import com.example.neuroforge.entity.DocumentType;
import lombok.Builder;

@Builder
public record DocumentCreateResponse(
        Long id,
        Long creatorId,
        String title,
        DocumentType documentType,
        String data
) {
}
