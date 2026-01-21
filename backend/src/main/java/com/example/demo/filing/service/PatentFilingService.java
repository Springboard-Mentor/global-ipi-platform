package com.example.demo.filing.service;

import com.example.demo.filing.dto.PatentFilingRequest;
import com.example.demo.filing.dto.PatentFilingResponse;
import java.util.List;

public interface PatentFilingService {
    
    PatentFilingResponse createFiling(Long userId, PatentFilingRequest request);
    
    PatentFilingResponse getFilingById(Long id, Long userId);
    
    List<PatentFilingResponse> getAllFilingsByUserId(Long userId);
    
    PatentFilingResponse updateFiling(Long id, Long userId, PatentFilingRequest request);
    
    void deleteFiling(Long id, Long userId);
    
    String computeStatus(PatentFilingResponse filing);

    PatentFilingResponse getFilingByIdAdmin(Long id);
    
    List<PatentFilingResponse> getAllFilingsAdmin();
    
    PatentFilingResponse updateFilingStatusAdmin(Long id, String status);
    
    PatentFilingResponse updateFilingFeedbackAdmin(Long id, String feedback, List<String> requestedFields);

    PatentFilingResponse updateFilingFeedbackAdmin(Long id, String feedback);
    
    void performBulkAction(List<Long> ids, String action, String value);
}
