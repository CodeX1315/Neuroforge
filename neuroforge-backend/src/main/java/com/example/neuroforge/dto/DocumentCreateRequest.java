package com.example.neuroforge.dto;

import com.example.neuroforge.entity.DocumentType;

public record DocumentCreateRequest(
        Long projectId,
        String title,
        DocumentType documentType,
        String data
) {
}
