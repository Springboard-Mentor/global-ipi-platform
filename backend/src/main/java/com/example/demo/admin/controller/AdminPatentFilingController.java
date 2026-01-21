package com.example.demo.admin.controller;

import com.example.demo.filing.dto.PatentFilingResponse;
import com.example.demo.filing.service.PatentFilingService;
import com.example.demo.admin.dto.BulkActionRequest;
import com.example.demo.admin.dto.FilingFeedbackRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

@RestController
@RequestMapping("/api/admin/patent-filings")
@RequiredArgsConstructor
public class AdminPatentFilingController {

    private final PatentFilingService filingService;

    @GetMapping
    public ResponseEntity<List<PatentFilingResponse>> getAllFilings() {
        // In a real app, implement pagination and filtering in service
        // For now, fetching all for admin
        return ResponseEntity.ok(filingService.getAllFilingsAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatentFilingResponse> getFilingById(@PathVariable Long id) {
        return ResponseEntity.ok(filingService.getFilingByIdAdmin(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PatentFilingResponse> updateFilingStatus(
            @PathVariable Long id, 
            @RequestBody String status) {
        return ResponseEntity.ok(filingService.updateFilingStatusAdmin(id, status));
    }

    @PutMapping("/{id}/feedback")
    public ResponseEntity<PatentFilingResponse> updateFilingFeedback(
            @PathVariable Long id, 
            @RequestBody FilingFeedbackRequest request) {
        return ResponseEntity.ok(filingService.updateFilingFeedbackAdmin(id, request.getFeedback(), request.getRequestedFields()));
    }

    @PostMapping("/bulk-action")
    public ResponseEntity<Void> bulkAction(@RequestBody BulkActionRequest request) {
        filingService.performBulkAction(request.getIds(), request.getAction(), request.getValue());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportFilings() {
        List<PatentFilingResponse> filings = filingService.getAllFilingsAdmin();
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        // Header
        pw.println("ID,Title,Applicant,Status,Filing Date,App Number");

        for (PatentFilingResponse f : filings) {
             pw.printf("%d,\"%s\",\"%s\",%s,%s,%s%n",
                     f.getId(),
                     f.getTitle() != null ? f.getTitle().replace("\"", "\"\"") : "",
                     f.getApplicantName() != null ? f.getApplicantName().replace("\"", "\"\"") : "",
                     f.getStatus(),
                     f.getFilingDate(),
                     f.getApplicationNumber()
             );
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"filings.csv\"")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                .body(sw.toString());
    }
}
