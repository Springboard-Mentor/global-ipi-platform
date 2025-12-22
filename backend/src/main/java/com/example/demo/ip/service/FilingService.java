package com.example.demo.ip.service;

import com.example.demo.ip.entity.Filing;
import com.example.demo.ip.repository.FilingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FilingService {

    private final FilingRepository repository;

    public List<Filing> getTimeline(Long assetId) {
        return repository.findByIpAssetId(assetId);
    }
}
