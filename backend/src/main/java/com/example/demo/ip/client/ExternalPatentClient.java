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

import org.springframework.cache.annotation.Cacheable;

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

    /* =======================
       DATE NORMALIZATION
       ======================= */
    private String normalizeDate(Object value) {
        if (value == null) return null;

        String date = value.toString().trim();

        if (date.matches("\\d{4}-\\d{2}-\\d{2}")) return date;
        if (date.matches("\\d{4}-\\d{2}")) return date + "-01";
        if (date.matches("\\d{4}")) return date + "-01-01";

        return null;
    }

    /* =======================
       COUNTRY EXTRACTION
       ======================= */
    private String extractCountryFromPublication(String publicationNumber) {
        if (publicationNumber == null || publicationNumber.length() < 2) {
            return "UNKNOWN";
        }

        String country = publicationNumber.substring(0, 2).toUpperCase();

        return country.matches("[A-Z]{2}") ? country : "UNKNOWN";
    }

    /* =======================
       LEGAL STATUS (TRANSPARENT)
       ======================= */
    private String deriveLegalStatus(Map<String, Object> patent) {

        if (patent.get("grant_date") != null) {
            return "GRANTED";
        }

        if (patent.get("publication_date") != null) {
            return "PUBLISHED";
        }

        if (patent.get("filing_date") != null) {
            return "FILED";
        }

        return "UNKNOWN";
    }

    /* =======================
       SEARCH (NO PAGINATION)
       ======================= */
@Cacheable(
    value = "patent-search",
    key = "#query + '-' + #limit"
)
    public List<IPSearchResultDTO> searchPatents(String query, int limit) {

        if (apiKey == null || apiKey.isBlank()) {
            log.error("SerpAPI key not configured");
            return Collections.emptyList();
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://serpapi.com/search.json")
                    .queryParam("engine", "google_patents")
                    .queryParam("q", query)
                    .queryParam("num", limit)
                    .queryParam("api_key", apiKey)
                    .toUriString();

            ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );

            Map<String, Object> response = resp.getBody();
            if (response == null || !response.containsKey("organic_results")) {
                return Collections.emptyList();
            }

            ObjectMapper mapper = new ObjectMapper();

            List<Map<String, Object>> results =
                    ((List<?>) response.get("organic_results")).stream()
                            .filter(Map.class::isInstance)
                            .map(o -> mapper.convertValue(o, new TypeReference<Map<String, Object>>() {}))
                            .toList();

            return results.stream()
                    .map(this::mapToDto)
                    .toList();

        } catch (Exception e) {
            log.error("Error calling SerpAPI", e);
            return Collections.emptyList();
        }
    }

    /* =======================
       DTO MAPPING (CORE LOGIC)
       ======================= */
    private IPSearchResultDTO mapToDto(Map<String, Object> patent) {

        IPSearchResultDTO dto = new IPSearchResultDTO();

        String publicationNumber =
                patent.get("publication_number") != null
                        ? patent.get("publication_number").toString()
                        : null;

        dto.setTitle((String) patent.getOrDefault("title", "Untitled Patent"));

        dto.setApplicationNumber(
                patent.get("application_number") != null
                        ? patent.get("application_number").toString()
                        : publicationNumber != null ? publicationNumber : "UNKNOWN"
        );

        dto.setAssetType("PATENT");
        dto.setCountry(extractCountryFromPublication(publicationNumber));
        dto.setLegalStatus(deriveLegalStatus(patent));

        dto.setOwnerName(
                patent.get("assignee") != null
                        ? patent.get("assignee").toString()
                        : "UNKNOWN"
        );

        dto.setInventorName(
                patent.get("inventor") != null
                        ? patent.get("inventor").toString()
                        : "UNKNOWN"
        );

        dto.setAbstractText(
                patent.get("snippet") != null
                        ? patent.get("snippet").toString()
                        : ""
        );

        dto.setFilingDate(normalizeDate(patent.get("filing_date")));
        // Try multiple field names for publication date (Google Patents API may use different keys)
        Object pubDate = patent.get("publication_date") != null ? patent.get("publication_date") 
                         : patent.get("publication_date_raw");
        String normalizedPubDate = normalizeDate(pubDate);
        dto.setPublicationDate(normalizedPubDate);
        if (normalizedPubDate == null) {
            log.debug("No publication date found for patent: {}. Available date fields: {}", 
                     dto.getApplicationNumber(), patent.keySet().stream()
                     .filter(k -> k.toString().toLowerCase().contains("date") || k.toString().toLowerCase().contains("publish"))
                     .toList());
        }
        dto.setPriorityDate(normalizeDate(patent.get("priority_date")));
        dto.setGrantDate(normalizeDate(patent.get("grant_date")));

        dto.setPatentLink(
                patent.get("patent_link") != null
                        ? patent.get("patent_link").toString()
                        : null
        );

        dto.setPdfLink(
                patent.get("pdf") != null
                        ? patent.get("pdf").toString()
                        : null
        );

        dto.setThumbnail(
                patent.get("thumbnail") != null
                        ? patent.get("thumbnail").toString()
                        : null
        );

        dto.setReferenceSource("GOOGLE_PATENTS");

        return dto;
    }
}
