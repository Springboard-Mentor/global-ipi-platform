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

    private static final String BASE_URL = "https://serpapi.com/search.json";

    @SuppressWarnings("unchecked")
    public List<IPSearchResultDTO> searchPatents(String keyword, int limit) {

        try {
            String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                    .queryParam("engine", "google_patents")
                    .queryParam("q", keyword)
                    .queryParam("num", limit)
                    .queryParam("api_key", apiKey)
                    .toUriString();

            log.info("Calling SerpAPI Google Patents");

            Map<String, Object> response =
                    restTemplate.getForObject(url, Map.class);

            if (response == null || !response.containsKey("organic_results")) {
                return Collections.emptyList();
            }

            List<Map<String, Object>> results =
                    (List<Map<String, Object>>) response.get("organic_results");

            return results.stream()
                    .map(this::mapToDto)
                    .toList();

        } catch (Exception e) {
            log.error("SerpAPI error", e);
            return Collections.emptyList();
        }
    }

    private IPSearchResultDTO mapToDto(Map<String, Object> patent) {

        IPSearchResultDTO dto = new IPSearchResultDTO();
        dto.setTitle((String) patent.get("title"));
        dto.setApplicationNumber((String) patent.get("publication_number"));
        dto.setCountry("US");
        dto.setAssetType("PATENT");
        dto.setStatus("PUBLISHED");

        return dto;
    }
}
