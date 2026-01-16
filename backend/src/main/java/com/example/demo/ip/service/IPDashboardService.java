package com.example.demo.ip.service;

import java.util.Map;

import com.example.demo.ip.dto.IPAssetDTO;
import com.example.demo.ip.entity.IPAsset;
import com.example.demo.ip.exception.IPAssetNotFoundException;
import com.example.demo.ip.mapper.IPAssetMapper;
import com.example.demo.ip.repository.FilingRepository;
import com.example.demo.ip.repository.IPAssetRepository;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IPDashboardService {

    private final IPAssetRepository assetRepository;
    private final FilingRepository filingRepository;

    public Map<String, Long> legalStatusSummary() {
    return assetRepository.countByLegalStatus()
            .stream()
            .filter(r -> r[0] != null)
            .collect(Collectors.toMap(
                r -> ((String) r[0]).toUpperCase(),
                r -> (Long) r[1]
            ));
}


    public List<Map<String, Object>> filingTrend() {
        return filingRepository.filingTrend()
                .stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", row[0]);
                    map.put("count", row[1]);
                    return map;
                })
                .toList();
    }
}

