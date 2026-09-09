package com.example.neuroforge.dto;

import lombok.Builder;

@Builder
public record ReportUpdateRequest(
        String data
) { }
