package com.project.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JurisdictionDensityDTO {
    private String jurisdiction;
    private Long count;
}