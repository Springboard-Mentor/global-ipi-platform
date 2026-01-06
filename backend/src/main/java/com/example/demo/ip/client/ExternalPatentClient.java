package com.example.demo.ip.client;

import com.example.demo.ip.dto.IPSearchResultDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExternalPatentClient {

        private final RestTemplate restTemplate;

        @Value("${serpapi.key}")
        private String apiKey;

        private String normalizeDate(Object value) {
                if (value == null)
                        return null;

                String date = value.toString();
                return date.length() == 10 ? date : null;
        }

        public List<IPSearchResultDTO> searchPatents(String query, int limit) {

                if (apiKey == null || apiKey.isBlank()) {
                        log.error("SerpAPI key not configured properly. Please set a valid API key in application.properties");
                        return Collections.emptyList();
                }

                try {
                        String url = UriComponentsBuilder.fromHttpUrl("https://serpapi.com/search.json")
                                        .queryParam("engine", "google_patents")
                                        .queryParam("q", query)
                                        .queryParam("num", limit)
                                        .queryParam("api_key", apiKey)
                                        .toUriString();

                        log.info("Calling SerpAPI Google Patents");

                        ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                                url,
                                HttpMethod.GET,
                                null,
                                new ParameterizedTypeReference<Map<String, Object>>() {}
                        );

                        Map<String, Object> response = resp.getBody();
                        if (response == null || !response.containsKey("organic_results")) {
                                return Collections.emptyList();
                        }

                        Object organic = response.get("organic_results");
                        List<Map<String, Object>> results;
                        if (organic instanceof List) {
                                ObjectMapper mapper = new ObjectMapper();
                                results = ((List<?>) organic).stream()
                                        .filter(Map.class::isInstance)
                                        .map(o -> mapper.convertValue(o, new TypeReference<Map<String, Object>>() {}))
                                        .toList();
                        } else {
                                results = Collections.emptyList();
                        }

                        return results.stream()
                                        .map(this::mapToDto)
                                        .toList();

                } catch (Exception e) {
                        log.error("Error calling SerpAPI", e);
                        return Collections.emptyList();
                }
        }

        public List<IPSearchResultDTO> searchPatents(String query, int limit, int page) {

                String url = UriComponentsBuilder.fromHttpUrl("https://serpapi.com/search.json")
                                .queryParam("engine", "google_patents")
                                .queryParam("q", query)
                                .queryParam("num", limit)
                                .queryParam("start", page * limit)
                                .queryParam("api_key", apiKey)
                                .toUriString();

                ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<Map<String, Object>>() {}
                );

                Map<String, Object> response = resp.getBody();
                if (response == null || !response.containsKey("organic_results")) {
                        return List.of();
                }

                Object organic = response.get("organic_results");
                List<Map<String, Object>> results;
                if (organic instanceof List) {
                        ObjectMapper mapper = new ObjectMapper();
                        results = ((List<?>) organic).stream()
                                .filter(Map.class::isInstance)
                                .map(o -> mapper.convertValue(o, new TypeReference<Map<String, Object>>() {}))
                                .toList();
                } else {
                        results = List.of();
                }

                return results.stream()
                                .map(this::mapToDto)
                                .toList();
        }

        private IPSearchResultDTO mapToDto(Map<String, Object> patent) {

                IPSearchResultDTO dto = new IPSearchResultDTO();

                dto.setTitle((String) patent.getOrDefault("title", "Untitled Patent"));
                dto.setApplicationNumber((String) patent.getOrDefault("publication_number", "N/A"));
                dto.setAssetType("PATENT");

                // Country / Jurisdiction
                String pub = dto.getApplicationNumber();

                if (pub != null && pub.startsWith("US")) {
                        dto.setCountry("US");
                } else if (pub != null && pub.startsWith("EP")) {
                        dto.setCountry("EU");
                } else {
                        dto.setCountry("Unknown");
                }

                // Status
                dto.setStatus(
                                patent.get("status") != null
                                                ? patent.get("status").toString()
                                                : "PUBLISHED");

                // Assignee (STRING, not list)
                dto.setOwnerName(
                                patent.get("assignee") != null
                                                ? patent.get("assignee").toString()
                                                : "Unknown");

                // Inventor (STRING, not list)
                dto.setInventorName(
                                patent.get("inventor") != null
                                                ? patent.get("inventor").toString()
                                                : null);

                // Abstract / snippet
                dto.setAbstractText(
                                patent.get("snippet") != null
                                                ? patent.get("snippet").toString()
                                                : "");

                // Dates
                dto.setFilingDate(normalizeDate(patent.get("filing_date")));
                dto.setPublicationDate(normalizeDate(patent.get("publication_date")));

                dto.setReferenceSource("GOOGLE_PATENTS");

                // Dates
                dto.setPriorityDate(normalizeDate(patent.get("priority_date")));
                dto.setGrantDate(normalizeDate(patent.get("grant_date")));

                // Links
                dto.setPatentLink(
                                patent.get("patent_link") != null
                                                ? patent.get("patent_link").toString()
                                                : null);

                dto.setPdfLink(
                                patent.get("pdf") != null
                                                ? patent.get("pdf").toString()
                                                : null);

                // Thumbnail
                dto.setThumbnail(
                                patent.get("thumbnail") != null
                                                ? patent.get("thumbnail").toString()
                                                : null);

                return dto;
        }

}
