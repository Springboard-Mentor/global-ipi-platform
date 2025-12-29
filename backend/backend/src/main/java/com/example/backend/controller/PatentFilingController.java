package com.example.backend.controller;

import com.example.backend.model.PatentFiling;
import com.example.backend.repository.PatentFilingRepository;
import com.example.backend.service.EmailService;
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
    
    @Autowired
    private EmailService emailService;
    
    // Get total count of patent filings
    @GetMapping("/count")
    public ResponseEntity<Long> getPatentFilingsCount() {
        try {
            long count = patentFilingRepository.count();
            System.out.println("📊 Patent filings count requested: " + count);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("❌ ERROR getting patent filings count:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }
    
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
            System.out.println("📋 Fetching patent filings for user: " + userId);
            List<PatentFiling> filings = patentFilingRepository.findByUserId(userId);
            System.out.println("✅ Found " + filings.size() + " filings for user: " + userId);
            return ResponseEntity.ok(filings);
        } catch (Exception e) {
            System.err.println("❌ ERROR fetching filings for user " + userId + ":");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Get ALL patent filings (for admin/debugging)
    @GetMapping("/all")
    public ResponseEntity<List<PatentFiling>> getAllPatentFilings() {
        try {
            System.out.println("📋 Fetching ALL patent filings");
            List<PatentFiling> filings = patentFilingRepository.findAll();
            System.out.println("✅ Found " + filings.size() + " total filings");
            return ResponseEntity.ok(filings);
        } catch (Exception e) {
            System.err.println("❌ ERROR fetching all filings:");
            e.printStackTrace();
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
    
    // Update patent filing stages with email notification on grant
    @PutMapping("/{id}/stages")
    public ResponseEntity<Map<String, Object>> updatePatentFilingStages(
            @PathVariable Long id,
            @RequestBody Map<String, Object> stageUpdates) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            return patentFilingRepository.findById(id)
                    .map(filing -> {
                        boolean wasGranted = filing.getStage5Granted() != null && filing.getStage5Granted();
                        
                        // Update stages based on request
                        if (stageUpdates.containsKey("stage1Filed")) {
                            filing.setStage1Filed((Boolean) stageUpdates.get("stage1Filed"));
                        }
                        if (stageUpdates.containsKey("stage2AdminReview")) {
                            filing.setStage2AdminReview((Boolean) stageUpdates.get("stage2AdminReview"));
                        }
                        if (stageUpdates.containsKey("stage3TechnicalReview")) {
                            filing.setStage3TechnicalReview((Boolean) stageUpdates.get("stage3TechnicalReview"));
                        }
                        if (stageUpdates.containsKey("stage4Verification")) {
                            filing.setStage4Verification((Boolean) stageUpdates.get("stage4Verification"));
                        }
                        if (stageUpdates.containsKey("stage5Granted")) {
                            filing.setStage5Granted((Boolean) stageUpdates.get("stage5Granted"));
                        }
                        
                        // Check if all stages are complete
                        boolean allStagesComplete = 
                            filing.getStage1Filed() != null && filing.getStage1Filed() &&
                            filing.getStage2AdminReview() != null && filing.getStage2AdminReview() &&
                            filing.getStage3TechnicalReview() != null && filing.getStage3TechnicalReview() &&
                            filing.getStage4Verification() != null && filing.getStage4Verification() &&
                            filing.getStage5Granted() != null && filing.getStage5Granted();
                        
                        // Update status based on stages
                        if (allStagesComplete) {
                            filing.setStatus("Granted");
                            
                            // Send email notification if patent just became granted
                            if (!wasGranted && filing.getStage5Granted()) {
                                try {
                                    emailService.sendPatentGrantedEmail(
                                        filing.getApplicantEmail(),
                                        filing.getApplicantName(),
                                        filing.getInventionTitle(),
                                        filing.getId()
                                    );
                                    System.out.println("✅ Patent granted email sent to: " + filing.getApplicantEmail());
                                } catch (Exception emailException) {
                                    System.err.println("❌ Failed to send patent granted email: " + emailException.getMessage());
                                    emailException.printStackTrace();
                                    // Continue even if email fails
                                }
                            }
                        } else if (filing.getStage4Verification() != null && filing.getStage4Verification()) {
                            filing.setStatus("Under Verification");
                        } else if (filing.getStage3TechnicalReview() != null && filing.getStage3TechnicalReview()) {
                            filing.setStatus("Technical Review");
                        } else if (filing.getStage2AdminReview() != null && filing.getStage2AdminReview()) {
                            filing.setStatus("Admin Review");
                        } else {
                            filing.setStatus("Filed");
                        }
                        
                        PatentFiling savedFiling = patentFilingRepository.save(filing);
                        
                        response.put("success", true);
                        response.put("message", "Stages updated successfully");
                        response.put("status", savedFiling.getStatus());
                        response.put("allStagesComplete", allStagesComplete);
                        response.put("emailSent", !wasGranted && allStagesComplete);
                        
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("❌ ERROR updating patent filing stages:");
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "Failed to update stages: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
