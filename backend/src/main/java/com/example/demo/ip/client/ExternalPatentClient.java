package com.example.demo.ip.client;

import com.example.demo.ip.dto.IPSearchResultDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExternalPatentClient {

    private final RestTemplate restTemplate;

    @Value("${serpapi.api.key}")
    private String apiKey;

    private static final String SERPAPI_URL = "https://serpapi.com/search.json";

    @SuppressWarnings("unchecked")
    public List<IPSearchResultDTO> searchPatents(String query, int limit) {

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("SerpAPI key not configured");
            return Collections.emptyList();
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(SERPAPI_URL)
                    .queryParam("engine", "google_patents")
                    .queryParam("q", query)
                    .queryParam("num", limit)
                    .queryParam("api_key", apiKey)
                    .toUriString();

            log.info("Calling SerpAPI Google Patents");

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !response.containsKey("organic_results")) {
                return Collections.emptyList();
            }

            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("organic_results");

            return results.stream()
                    .map(this::mapToDto)
                    .toList();

        } catch (Exception e) {
            log.error("Error calling SerpAPI", e);
            return Collections.emptyList();
        }
    }

    private IPSearchResultDTO mapToDto(Map<String, Object> patent) {

    IPSearchResultDTO dto = new IPSearchResultDTO();

    dto.setTitle((String) patent.getOrDefault("title", "Untitled Patent"));
    dto.setApplicationNumber((String) patent.getOrDefault("publication_number", "N/A"));
    dto.setAssetType("PATENT");

    // Country / Jurisdiction
    dto.setCountry(
            patent.get("jurisdiction") != null
                    ? patent.get("jurisdiction").toString()
                    : "Unknown"
    );

    // Status
    dto.setStatus(
            patent.get("status") != null
                    ? patent.get("status").toString()
                    : "PUBLISHED"
    );

    // Assignee
    dto.setOwnerName(
            patent.get("assignee") != null
                    ? patent.get("assignee").toString()
                    : "Unknown"
    );

    // Inventor
    dto.setInventorName(
            patent.get("inventor") != null
                    ? patent.get("inventor").toString()
                    : null
    );

    // Abstract / snippet
    dto.setAbstractText(
            patent.get("snippet") != null
                    ? patent.get("snippet").toString()
                    : ""
    );

    // Dates
    dto.setFilingDate(
            patent.get("filing_date") != null
                    ? patent.get("filing_date").toString()
                    : null
    );

    dto.setPublicationDate(
            patent.get("publication_date") != null
                    ? patent.get("publication_date").toString()
                    : null
    );

    // Links
    // dto.setPatentLink((String) patent.get("patent_link"));
    // dto.setPdf((String) patent.get("pdf"));

    return dto;
}

}
