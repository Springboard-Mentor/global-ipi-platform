package com.project.backend.controller;

import com.project.backend.entity.Notification;
import com.project.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // ✅ EXISTING GET ENDPOINT
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Integer userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    /**
     * ✅ NEW POST ENDPOINT (Fixed Type Mismatch)
     * Handles manual notification creation from the frontend "Save Alerts" button.
     */
    @PostMapping("/create")
    public ResponseEntity<?> createNotification(@RequestBody Map<String, Object> payload) {
        try {
            // 🔒 FIX: Convert to Integer directly to match NotificationService.sendAlert(Integer, ...)
            Integer userId = Integer.valueOf(payload.get("userId").toString());
            
            String message = (String) payload.get("message");
            String type = (String) payload.get("type");
            
            // Handle optional assetId safely
            Integer assetId = null;
            if (payload.get("assetId") != null) {
                assetId = Integer.valueOf(payload.get("assetId").toString());
            }

            // Now passing (Integer, Integer, String, String) -> Matches Service perfectly
            notificationService.sendAlert(userId, assetId, message, type);
            
            return ResponseEntity.ok("Notification saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving notification: " + e.getMessage());
        }
    }
}