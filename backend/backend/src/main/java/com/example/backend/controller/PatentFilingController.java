package com.example.backend.controller;

import com.example.backend.model.PatentFiling;
import com.example.backend.repository.PatentFilingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patent-filing")
@CrossOrigin(origins = "*")
public class PatentFilingController {
    
    @Autowired
    private PatentFilingRepository patentFilingRepository;
    
    // Submit new patent filing
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitPatentFiling(@RequestBody PatentFiling patentFiling) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== Received Patent Filing Request ===");
            System.out.println("User ID: " + patentFiling.getUserId());
            System.out.println("Applicant Name: " + patentFiling.getApplicantName());
            System.out.println("Invention Title: " + patentFiling.getInventionTitle());
            System.out.println("Payment ID: " + patentFiling.getPaymentId());
            
            // Save patent filing to database
            PatentFiling savedFiling = patentFilingRepository.save(patentFiling);
            
            System.out.println("✅ Patent filing saved with ID: " + savedFiling.getId());
            
            response.put("success", true);
            response.put("message", "Patent filing submitted successfully");
            response.put("id", savedFiling.getId());
            response.put("filingId", savedFiling.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ ERROR saving patent filing:");
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "Failed to submit patent filing: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Get all patent filings for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PatentFiling>> getUserPatentFilings(@PathVariable String userId) {
        try {
            List<PatentFiling> filings = patentFilingRepository.findByUserId(userId);
            return ResponseEntity.ok(filings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Get patent filing by ID
    @GetMapping("/{id}")
    public ResponseEntity<PatentFiling> getPatentFilingById(@PathVariable Long id) {
        try {
            return patentFilingRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Get all patent filings by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PatentFiling>> getPatentFilingsByStatus(@PathVariable String status) {
        try {
            List<PatentFiling> filings = patentFilingRepository.findByStatus(status);
            return ResponseEntity.ok(filings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Update patent filing status
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updatePatentFilingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            return patentFilingRepository.findById(id)
                    .map(filing -> {
                        filing.setStatus(statusUpdate.get("status"));
                        patentFilingRepository.save(filing);
                        
                        response.put("success", true);
                        response.put("message", "Status updated successfully");
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
