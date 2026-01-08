package com.project.backend.controller;

import com.project.backend.entity.UserFiling;
import com.project.backend.service.FilingTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FilingTrackerController {

    @Autowired private FilingTrackerService filingTrackerService;

    /**
     * ✅ GET TRACKER LIST (For Filing Tracker Page)
     */
    @GetMapping("/tracker/all")
    public ResponseEntity<List<UserFiling>> getAllTracked() {
        return ResponseEntity.ok(filingTrackerService.getAllFilings());
    }

    /**
     * ✅ RESTORED: GET FILINGS (Fixes 405 Error on PatentsPage.jsx)
     * This allows the "My Patents" page to fetch the list of filings again.
     */
    @GetMapping("/filings")
    public ResponseEntity<List<UserFiling>> getFilings() {
        return ResponseEntity.ok(filingTrackerService.getAllFilings());
    }

    /**
     * ✅ TRACK ASSET
     */
    @PostMapping("/tracker/add/{assetId}")
    public ResponseEntity<?> trackAsset(@PathVariable Integer assetId, @RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("User email is required to track asset.");
            }
            return ResponseEntity.ok(filingTrackerService.trackAsset(email, assetId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * ✅ UPDATE STATUS
     */
    @PutMapping("/tracker/update/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(filingTrackerService.updateStatus(id, status));
    }

    /**
     * ✅ CREATE NEW FILING (For New Filing Form)
     */
    @PostMapping("/filings")
    public ResponseEntity<?> createFiling(@RequestBody UserFiling filing) {
        try {
            UserFiling savedFiling = filingTrackerService.createFiling(filing);
            return ResponseEntity.ok(savedFiling);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving filing: " + e.getMessage());
        }
    }

    /**
     * ✅ DELETE FILING
     */
    @DeleteMapping("/tracker/delete/{id}")
    public ResponseEntity<?> deleteFiling(@PathVariable Long id) {
        try {
            filingTrackerService.deleteFiling(id);
            return ResponseEntity.ok("Filing deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting filing: " + e.getMessage());
        }
    }
}