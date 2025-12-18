package com.example.backend.service;

import com.example.backend.model.Patent;
import com.example.backend.model.SearchRequest;
import com.example.backend.model.SearchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PatentService {

    private static final Logger logger = LoggerFactory.getLogger(PatentService.class);

    private final WebClient webClient;

    @Value("${australia.patent.api.base.url}")
    private String baseUrl;

    public PatentService(WebClient.Builder webClientBuilder, @Value("${australia.patent.api.base.url}") String baseUrl) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    public List<Patent> quickSearch(SearchRequest request) {
        try {
            SearchResponse response = webClient.post()
                    .uri("/search/quick")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(SearchResponse.class)
                    .block(Duration.ofSeconds(10));
            return response != null && response.getResults() != null ? response.getResults() : Collections.emptyList();
        } catch (Exception e) {
            logger.error("Error calling patent search API", e);
            return Collections.emptyList();
        }
    }

    public Mono<Patent> getPatent(String ipRightIdentifier) {
        return webClient.get()
                .uri("/patent/{ipRightIdentifier}", ipRightIdentifier)
                .retrieve()
                .bodyToMono(Patent.class);
    }

    // Add other methods as needed
}