package com.example.backend.service;

import com.example.backend.model.Patent;
import com.example.backend.model.SearchRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PatentService {

    private static final Logger logger = LoggerFactory.getLogger(PatentService.class);

    private final RestTemplate restTemplate;

    public PatentService() {
        this.restTemplate = new RestTemplate();
    }

    public List<Patent> quickSearch(SearchRequest request) {
        List<Patent> results = new ArrayList<>();
        
        // First check local database
        results.addAll(getLocalPatents(request.getQuery()));
        
        // Then try API
        try {
            // Use google_patents engine with q parameter for keyword search
            String url = "https://serpapi.com/search.json?engine=google_patents&q=" 
                + URLEncoder.encode(request.getQuery(), StandardCharsets.UTF_8.toString()) 
                + "&api_key=911c64677374efe91d47afc2a41d11c9c175d3140dd130b31ce7bb56010ed8e0";
            logger.info("Calling SerpAPI with URL: {}", url);
            String response = restTemplate.getForObject(url, String.class);
            logger.info("API Response received");

            JsonObject json = JsonParser.parseString(response).getAsJsonObject();
            
            // Check if organic_results exists
            if (json.has("organic_results") && json.get("organic_results").isJsonArray()) {
                var resultsArray = json.getAsJsonArray("organic_results");
                int count = Math.min(10, resultsArray.size()); // Get first 10 results
                
                for (int i = 0; i < count; i++) {
                    JsonObject patentObj = resultsArray.get(i).getAsJsonObject();
                    
                    // Skip scholar results, only process patent results
                    if (patentObj.has("is_scholar") && patentObj.get("is_scholar").getAsBoolean()) {
                        continue;
                    }
                    
                    Patent patent = new Patent();
                    
                    // Get patent ID
                    String patentId = patentObj.has("patent_id") ? patentObj.get("patent_id").getAsString() : 
                                     (patentObj.has("publication_number") ? patentObj.get("publication_number").getAsString() : "PATENT-" + i);
                    patent.setId(patentId);
                    patent.setIpRightIdentifier(patentId);
                    patent.setType("Patent");
                    patent.setAssetNumber(patentObj.has("publication_number") ? patentObj.get("publication_number").getAsString() : patentId);
                    
                    // Title
                    patent.setTitle(patentObj.has("title") ? patentObj.get("title").getAsString() : "Untitled Patent");
                    
                    // Abstract/Snippet
                    patent.setAbstractText(patentObj.has("snippet") ? patentObj.get("snippet").getAsString() : "No abstract available");
                    
                    // Assignee
                    patent.setAssignee(patentObj.has("assignee") ? patentObj.get("assignee").getAsString() : "N/A");
                    
                    // Inventor
                    patent.setInventor(patentObj.has("inventor") ? patentObj.get("inventor").getAsString() : "N/A");
                    
                    // Language as jurisdiction indicator
                    String jurisdiction = "N/A";
                    if (patentObj.has("language")) {
                        jurisdiction = patentObj.get("language").getAsString();
                    }
                    patent.setJurisdiction(jurisdiction);
                    
                    // Filing Date
                    patent.setFilingDate(patentObj.has("filing_date") ? patentObj.get("filing_date").getAsString() : 
                                        (patentObj.has("priority_date") ? patentObj.get("priority_date").getAsString() : "N/A"));
                    
                    // Status - determine from grant_date or country_status
                    String status = "Active";
                    if (patentObj.has("grant_date")) {
                        status = "Granted";
                    } else if (patentObj.has("filing_date") && !patentObj.has("grant_date")) {
                        status = "Application";
                    }
                    patent.setStatus(status);
                    
                    // CPC Classification
                    String classInfo = "N/A";
                    if (patentObj.has("cpc")) {
                        classInfo = patentObj.get("cpc").getAsString();
                        if (patentObj.has("cpc_description")) {
                            classInfo += " - " + patentObj.get("cpc_description").getAsString();
                        }
                    }
                    patent.setClassInfo(classInfo);
                    
                    // Additional details - combine multiple fields
                    StringBuilder details = new StringBuilder();
                    if (patentObj.has("publication_date")) {
                        details.append("Publication Date: ").append(patentObj.get("publication_date").getAsString()).append("; ");
                    }
                    if (patentObj.has("grant_date")) {
                        details.append("Grant Date: ").append(patentObj.get("grant_date").getAsString()).append("; ");
                    }
                    if (patentObj.has("priority_date")) {
                        details.append("Priority Date: ").append(patentObj.get("priority_date").getAsString()).append("; ");
                    }
                    if (patentObj.has("pdf")) {
                        details.append("PDF: ").append(patentObj.get("pdf").getAsString());
                    }
                    patent.setDetails(details.length() > 0 ? details.toString() : "N/A");
                    
                    patent.setApiSource("SerpAPI - Google Patents");
                    patent.setLastUpdated(java.time.LocalDateTime.now().toString());
                    
                    results.add(patent);
                    logger.info("Parsed patent: {} ({})", patent.getTitle(), patentId);
                }
                logger.info("Successfully parsed {} patents from API", results.size() - getLocalPatents(request.getQuery()).size());
            } else {
                logger.warn("No organic_results found in API response");
            }
        } catch (Exception e) {
            logger.error("Error calling SerpApi", e);
        }
        
        // If no results, return sample data
        if (results.isEmpty()) {
            Patent patent = new Patent();
            patent.setId(request.getQuery());
            patent.setIpRightIdentifier(request.getQuery());
            patent.setType("Patent");
            patent.setAssetNumber(request.getQuery());
            patent.setTitle("Sample Patent: " + request.getQuery());
            patent.setAbstractText("This is a sample patent for demonstration. Try searching for: 'machine learning', 'AI', 'solar panel', or 'battery technology'");
            patent.setAssignee("Sample Assignee Corp");
            patent.setInventor("John Doe");
            patent.setJurisdiction("US");
            patent.setFilingDate("2023-01-01");
            patent.setStatus("Active");
            patent.setApiSource("Local Sample Data");
            patent.setLastUpdated(java.time.LocalDateTime.now().toString());
            results.add(patent);
        }
        
        return results;
    }

    public Patent getPatentById(String patentId) {
        try {
            String url = "https://serpapi.com/search.json?engine=google_patents_details&patent_id=" 
                + patentId + "&api_key=911c64677374efe91d47afc2a41d11c9c175d3140dd130b31ce7bb56010ed8e0";
            logger.info("Fetching patent details for: {}", patentId);
            String response = restTemplate.getForObject(url, String.class);

            JsonObject json = JsonParser.parseString(response).getAsJsonObject();
            Patent patent = new Patent();
            
            // Map API response to Patent model
            patent.setId(patentId);
            patent.setIpRightIdentifier(patentId);
            patent.setType("Patent");
            patent.setAssetNumber(patentId);
            patent.setTitle(json.has("title") ? json.get("title").getAsString() : "No title available");
            patent.setAbstractText(json.has("abstract") ? json.get("abstract").getAsString() : "No abstract available");
            patent.setAssignee(json.has("assignee") ? json.get("assignee").getAsString() : "N/A");
            patent.setInventor(json.has("inventor") ? json.get("inventor").getAsString() : "N/A");
            patent.setJurisdiction(json.has("jurisdiction") ? json.get("jurisdiction").getAsString() : "N/A");
            patent.setFilingDate(json.has("filing_date") ? json.get("filing_date").getAsString() : "N/A");
            patent.setStatus(json.has("status") ? json.get("status").getAsString() : "Active");
            patent.setClassInfo(json.has("classifications") ? json.get("classifications").toString() : "N/A");
            patent.setApiSource("SerpAPI");
            patent.setLastUpdated(java.time.LocalDateTime.now().toString());
            
            return patent;
        } catch (Exception e) {
            logger.error("Error fetching patent details", e);
            // Return mock data as fallback
            Patent patent = new Patent();
            patent.setIpRightIdentifier(patentId);
            patent.setTitle("Detailed Patent: " + patentId);
            patent.setAbstractText("This is detailed patent information for: " + patentId + ". Additional details would be fetched from the API.");
            patent.setFilingDate("2023-01-01");
            return patent;
        }
    }

    private List<Patent> getLocalPatents(String query) {
        List<Patent> localDB = new ArrayList<>();
        
        // Create sample local patents
        Patent p1 = new Patent();
        p1.setId("US10123456B2");
        p1.setIpRightIdentifier("US10123456B2");
        p1.setType("Patent");
        p1.setAssetNumber("US10123456B2");
        p1.setTitle("Machine Learning System for Pattern Recognition");
        p1.setAbstractText("A machine learning system that uses neural networks to recognize and classify patterns in large datasets. The system employs deep learning algorithms to improve accuracy over time.");
        p1.setAssignee("Tech Innovations Inc.");
        p1.setInventor("Jane Smith, Robert Johnson");
        p1.setJurisdiction("United States");
        p1.setFilingDate("2020-03-15");
        p1.setStatus("Active");
        p1.setClassInfo("G06N 3/08 (Neural Networks)");
        p1.setApiSource("Local Database");
        p1.setLastUpdated("2024-01-15T10:30:00");
        localDB.add(p1);
        
        Patent p2 = new Patent();
        p2.setId("US10234567B2");
        p2.setIpRightIdentifier("US10234567B2");
        p2.setType("Patent");
        p2.setAssetNumber("US10234567B2");
        p2.setTitle("Artificial Intelligence Based Diagnostic System");
        p2.setAbstractText("An AI-powered diagnostic system that analyzes medical images and patient data to assist healthcare professionals in making accurate diagnoses. Utilizes convolutional neural networks and expert systems.");
        p2.setAssignee("MedTech Solutions LLC");
        p2.setInventor("Dr. Sarah Chen, Michael Williams");
        p2.setJurisdiction("United States");
        p2.setFilingDate("2019-11-20");
        p2.setStatus("Active");
        p2.setClassInfo("G16H 50/20 (Medical Diagnosis)");
        p2.setApiSource("Local Database");
        p2.setLastUpdated("2024-02-10T14:20:00");
        localDB.add(p2);
        
        Patent p3 = new Patent();
        p3.setId("US10345678B2");
        p3.setIpRightIdentifier("US10345678B2");
        p3.setType("Patent");
        p3.setAssetNumber("US10345678B2");
        p3.setTitle("Solar Panel Efficiency Optimization System");
        p3.setAbstractText("A system and method for optimizing solar panel efficiency through real-time monitoring and adjustment of panel orientation and electrical parameters. Includes machine learning algorithms for weather prediction.");
        p3.setAssignee("Green Energy Corp");
        p3.setInventor("David Martinez");
        p3.setJurisdiction("United States");
        p3.setFilingDate("2021-05-08");
        p3.setStatus("Active");
        p3.setClassInfo("H02S 40/00 (Solar Power Systems)");
        p3.setApiSource("Local Database");
        p3.setLastUpdated("2024-03-05T09:15:00");
        localDB.add(p3);
        
        Patent p4 = new Patent();
        p4.setId("US10456789B2");
        p4.setIpRightIdentifier("US10456789B2");
        p4.setType("Patent");
        p4.setAssetNumber("US10456789B2");
        p4.setTitle("Advanced Battery Management System with AI");
        p4.setAbstractText("An intelligent battery management system that uses artificial intelligence to optimize charging cycles, predict battery life, and prevent thermal runaway in lithium-ion batteries.");
        p4.setAssignee("PowerTech Industries");
        p4.setInventor("Emily Zhang, Alex Kumar");
        p4.setJurisdiction("United States");
        p4.setFilingDate("2020-09-12");
        p4.setStatus("Active");
        p4.setClassInfo("H01M 10/42 (Battery Management)");
        p4.setApiSource("Local Database");
        p4.setLastUpdated("2024-01-28T16:45:00");
        localDB.add(p4);
        
        Patent p5 = new Patent();
        p5.setId("US10567890B2");
        p5.setIpRightIdentifier("US10567890B2");
        p5.setType("Patent");
        p5.setAssetNumber("US10567890B2");
        p5.setTitle("Quantum Computing Error Correction Method");
        p5.setAbstractText("A novel method for error correction in quantum computing systems using topological codes and machine learning algorithms to detect and correct quantum bit errors in real-time.");
        p5.setAssignee("Quantum Innovations Ltd");
        p5.setInventor("Dr. Thomas Anderson");
        p5.setJurisdiction("United States");
        p5.setFilingDate("2021-07-22");
        p5.setStatus("Active");
        p5.setClassInfo("G06N 10/40 (Quantum Computing)");
        p5.setApiSource("Local Database");
        p5.setLastUpdated("2024-04-12T11:30:00");
        localDB.add(p5);
        
        // Filter based on query
        if (query == null || query.trim().isEmpty()) {
            return localDB;
        }
        
        String queryLower = query.toLowerCase();
        List<Patent> filtered = new ArrayList<>();
        for (Patent p : localDB) {
            if ((p.getTitle() != null && p.getTitle().toLowerCase().contains(queryLower)) ||
                (p.getAbstractText() != null && p.getAbstractText().toLowerCase().contains(queryLower)) ||
                (p.getId() != null && p.getId().toLowerCase().contains(queryLower)) ||
                (p.getAssignee() != null && p.getAssignee().toLowerCase().contains(queryLower)) ||
                (p.getInventor() != null && p.getInventor().toLowerCase().contains(queryLower))) {
                filtered.add(p);
            }
        }
        
        return filtered;
    }

    // Add other methods as needed
}