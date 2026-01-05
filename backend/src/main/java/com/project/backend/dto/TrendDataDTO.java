package com.project.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrendDataDTO {
    private String period; // Year or Month
    private Long count;
}