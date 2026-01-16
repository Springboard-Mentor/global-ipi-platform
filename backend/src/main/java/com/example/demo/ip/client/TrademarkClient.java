package com.example.demo.ip.client;

import com.example.demo.ip.dto.IPSearchResultDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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
public class TrademarkClient {

    private final RestTemplate restTemplate;

    @Value("${uspto.api.base-url:https://developer.uspto.gov/ibd-api/v1}")
    private String baseUrl;

    public List<IPSearchResultDTO> searchTrademarks(String keyword, int limit) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .path("/trademark/application/publications")
                    .queryParam("searchText", keyword)
                    .queryParam("rows", limit)
                    .toUriString();

            log.debug("Calling USPTO API: {}", url);
            ResponseEntity<GooglePatentResponse> response = restTemplate.getForEntity(
                    url,
                    GooglePatentResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().getResults().stream()
                        .filter(Objects::nonNull)
                        .map(this::mapToSearchResult)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.error("Error fetching trademarks from USPTO API: {}", e.getMessage(), e);
        }
        return Collections.emptyList();
    }

    private IPSearchResultDTO mapToSearchResult(GooglePatentResponse.Trademark tm) {
        IPSearchResultDTO dto = new IPSearchResultDTO();
        dto.setTitle(tm.getMarkIdentification());
        dto.setApplicationNumber(tm.getApplicationNumber());
        dto.setFilingDate(tm.getFilingDate());
        dto.setLegalStatus(tm.getLegalStatus());
        dto.setOwnerName(tm.getApplicantName());
        dto.setAssetType("TRADEMARK");
        return dto;
    }

    // Inner class to map Google Patent API response
    @lombok.Data
    @lombok.NoArgsConstructor
    public static class GooglePatentResponse {
        private List<Trademark> results;

        @lombok.Data
        @lombok.NoArgsConstructor
        public static class Trademark {
            private String markIdentification;
            private String applicationNumber;
            private String filingDate;
            private String LegalStatus;
            private String applicantName;
        }
    }

    public String getTrademarkDetails(String serialNumber) {

        String url = "https://tsdr.uspto.gov/ts/cd/casestatus/sn/"
                + serialNumber + "/content.json";

        return restTemplate.getForObject(url, String.class);
    }
}
