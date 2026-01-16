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

    /**
     * Derive legal status from entity (same logic as IPAssetMapper)
     * This ensures consistency between summary and individual asset displays
     */
    private String deriveLegalStatus(IPAsset entity) {
        // Use existing status if present and not null/empty
        if (entity.getLegalStatus() != null && !entity.getLegalStatus().trim().isEmpty()) {
            return entity.getLegalStatus();
        }

        // Otherwise derive from dates:
        // 1. Granted if grant date exists
        if (entity.getGrantDate() != null) {
            return "GRANTED";
        }

        // 2. Under examination if published but not granted
        if (entity.getPublicationDate() != null) {
            return "UNDER_EXAMINATION";
        }

        // 3. Filed if only filing date exists
        if (entity.getFilingDate() != null) {
            return "FILED";
        }

        // 4. Fallback
        return "PENDING_REVIEW";
    }

    public Map<String, Long> getLegalStatusSummary() {
        Map<String, Long> result = new LinkedHashMap<>();
        
        // Get all assets and derive status for each (consistent with mapper logic)
        List<IPAsset> allAssets = assetRepo.findAll();
        
        for (IPAsset asset : allAssets) {
            String status = deriveLegalStatus(asset);
            result.put(status, result.getOrDefault(status, 0L) + 1);
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
