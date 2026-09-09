package com.example.neuroforge.dto;

import lombok.Builder;


@Builder
public record DocumentUpdateRequest(
        String data
) { }
