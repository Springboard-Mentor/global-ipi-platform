package com.project.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeoLocationDTO {
    private String jurisdiction;
    private String jurisdictionName;
    private Long patentCount;
    private Long trademarkCount;
    private Long activeCount;
    private Long pendingCount;
    private Double latitude;
    private Double longitude;
    private Integer zoom;

    // Manual setter to resolve the "setCount" error in IPAssetService
    public void setCount(int count) {
        this.patentCount = (long) count;
    }
}