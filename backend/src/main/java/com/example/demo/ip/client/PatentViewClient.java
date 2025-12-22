package com.example.demo.ip.client;

import com.example.demo.ip.dto.IPSearchResultDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class PatentViewClient {

    private final RestTemplate restTemplate;

    @Value("${patentview.api.base-url:https://api.patentsview.org}")
    private String baseUrl;

    @Value("${patentview.api.key:}")
    private String apiKey;

    public List<IPSearchResultDTO> searchPatents(String keyword, int limit) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .path("/patents/query")
                    .queryParam("o", "{\"page\":1,\"per_page\":" + limit + "}")
                    .queryParam("f", "[\"patent_title\",\"patent_number\",\"patent_date\",\"inventors\",\"assignees\",\"patent_abstract\"]")
                    .queryParam("q", String.format("{\"_text_any\":{\"patent_title\":\"%s\"}}", keyword));
            
            // Add API key if available
            if (apiKey != null && !apiKey.isEmpty()) {
                builder = builder.queryParam("api_key", apiKey);
            }
            
            String url = builder.toUriString();

            log.debug("Calling PatentsView API: {}", url.replace(apiKey, "****"));
            
            ResponseEntity<PatentViewResponse> response = restTemplate.getForEntity(
                    url,
                    PatentViewResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().getPatents().stream()
                        .filter(Objects::nonNull)
                        .map(this::mapToSearchResult)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.error("Error fetching patents from PatentsView API: {}", e.getMessage(), e);
        }
        return Collections.emptyList();
    }

    private IPSearchResultDTO mapToSearchResult(PatentViewResponse.Patent patent) {
        IPSearchResultDTO dto = new IPSearchResultDTO();
        dto.setTitle(patent.getPatentTitle());
        dto.setApplicationNumber(patent.getPatentNumber());
        dto.setFilingDate(patent.getPatentDate());
        dto.setAbstractText(patent.getPatentAbstract());
        dto.setInventorName(patent.getInventors() != null && !patent.getInventors().isEmpty() ? 
                patent.getInventors().get(0).getInventorName() : null);
        dto.setOwnerName(patent.getAssignees() != null && !patent.getAssignees().isEmpty() ? 
                patent.getAssignees().get(0).getAssigneeName() : null);
        dto.setAssetType("PATENT");
        return dto;
    }

    @Data
    public static class PatentViewResponse {
        private List<Patent> patents;

        @Data
        public static class Patent {
            @JsonProperty("patent_title")
            private String patentTitle;
            
            @JsonProperty("patent_number")
            private String patentNumber;
            
            @JsonProperty("patent_date")
            private String patentDate;
            
            @JsonProperty("patent_abstract")
            private String patentAbstract;
            
            private List<Inventor> inventors;
            private List<Assignee> assignees;
        }

        @Data
        public static class Inventor {
            @JsonProperty("inventor_name")
            private String inventorName;
        }

        @Data
        public static class Assignee {
            @JsonProperty("assignee_name")
            private String assigneeName;
        }
    }
}
