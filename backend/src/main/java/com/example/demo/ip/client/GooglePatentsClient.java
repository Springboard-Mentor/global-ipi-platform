package com.example.demo.ip.client;

import com.example.demo.ip.dto.IPSearchResultDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class GooglePatentsClient {

    private final RestTemplate restTemplate;

    @Value("${serpapi.key:api_key}")
    private String apiKey;

    public List<IPSearchResultDTO> searchPatents(String query, int limit) {
        try {
            String url = String.format(
                "https://serpapi.com/search.json?engine=google_patents&q=%s&api_key=%s&num=%d",
                query.replace(" ", "+"), apiKey, limit
            );

            log.info("Calling SerpAPI: {}", url.replace(apiKey, "****"));
            
            ResponseEntity<SerpApiResponse> response = restTemplate.getForEntity(url, SerpApiResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().getOrganicResults().stream()
                    .map(this::mapToSearchResult)
                    .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.error("Error calling SerpAPI: {}", e.getMessage(), e);
        }
        return Collections.emptyList();
    }

    private IPSearchResultDTO mapToSearchResult(SerpApiResponse.Patent patent) {
        IPSearchResultDTO dto = new IPSearchResultDTO();
        dto.setTitle(patent.getTitle());
        dto.setApplicationNumber(patent.getPatentId());
        dto.setFilingDate(patent.getFilingDate());
        dto.setPublicationDate(patent.getPublicationDate());
        dto.setInventorName(patent.getInventor());
        dto.setOwnerName(patent.getAssignee());
        dto.setAssetType("PATENT");
        dto.setStatus("PUBLISHED");
        return dto;
    }

    @Data
    public static class SerpApiResponse {
        @JsonProperty("organic_results")
        private List<Patent> organicResults = Collections.emptyList();

        @Data
        public static class Patent {
            private String title;
            @JsonProperty("patent_id")
            private String patentId;
            @JsonProperty("filing_date")
            private String filingDate;
            @JsonProperty("publication_date")
            private String publicationDate;
            private String inventor;
            private String assignee;
        }
    }
}