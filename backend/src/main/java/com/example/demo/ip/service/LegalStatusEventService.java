package com.example.demo.ip.service;

import com.example.demo.ip.entity.IPAsset;
import com.example.demo.ip.entity.LegalStatusEvent;
import com.example.demo.ip.exception.IPAssetNotFoundException;
import com.example.demo.ip.repository.IPAssetRepository;
import com.example.demo.ip.repository.LegalStatusEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LegalStatusEventService {

    private final IPAssetRepository assetRepository;
    private final LegalStatusEventRepository eventRepository;

    /**
     * Generate legal status timeline if not present
     */
    public void generateTimelineIfMissing(Long assetId) {

        IPAsset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IPAssetNotFoundException("IP Asset not found"));

        // Avoid duplicate timeline creation
       if (!eventRepository.findByAssetOrderByEventDateAsc(asset).isEmpty()) {
    return;
}

        List<LegalStatusEvent> events = new ArrayList<>();

        if (asset.getFilingDate() != null) {
            events.add(buildEvent(asset, "FILED", asset.getFilingDate()));
        }

        if (asset.getPublicationDate() != null) {
            events.add(buildEvent(asset, "PUBLISHED", asset.getPublicationDate()));
        }

        if (asset.getGrantDate() != null) {
            events.add(buildEvent(asset, "GRANTED", asset.getGrantDate()));
        }

        eventRepository.saveAll(events);
    }

    /**
     * Fetch legal status timeline
     */
    public List<LegalStatusEvent> getTimeline(Long assetId) {

        IPAsset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IPAssetNotFoundException("IP Asset not found"));

        generateTimelineIfMissing(assetId);

        return eventRepository.findByAssetOrderByEventDateAsc(asset);
    }

    private LegalStatusEvent buildEvent(IPAsset asset, String status, java.time.LocalDate date) {
        LegalStatusEvent event = new LegalStatusEvent();
        event.setAsset(asset);
        event.setStatus(status);
        event.setEventDate(date);
        event.setCountry(asset.getCountry());
        event.setSource(asset.getReferenceSource());
        return event;
    }
}
