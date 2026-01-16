package com.example.demo.dashboard;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.ip.entity.IPAsset;
import com.example.demo.ip.repository.IPAssetRepository;
import com.example.demo.ip.repository.LegalStatusEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IPAssetRepository assetRepo;
    private final LegalStatusEventRepository eventRepo;

    public Map<String, Long> getLegalStatusSummary() {
        Map<String, Long> result = new LinkedHashMap<>();
        for (Object[] row : assetRepo.countByLegalStatus()) {
            if (row[0] == null) continue;
            result.put((String) row[0], (Long) row[1]);
        }
        return result;
    }

  public List<LegalStatusTimelineDTO> getLegalStatusTimeline(Long assetId) {
    IPAsset asset = assetRepo.findById(assetId)
            .orElseThrow(() -> new ResourceNotFoundException("IP Asset not found"));

    return eventRepo.findByAssetOrderByEventDateAsc(asset)
            .stream()
            .map(e -> new LegalStatusTimelineDTO(
                    e.getStatus(),
                    e.getEventDate(),
                    e.getCountry(),
                    e.getSource()
            ))
            .toList();
}

}
