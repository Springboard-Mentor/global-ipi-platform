package com.project.backend.controller;

import com.project.backend.entity.Subscription;
import com.project.backend.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> addSubscription(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String planName = (String) payload.get("planName");
            String billingCycle = (String) payload.get("billingCycle");
            Double amount = Double.valueOf(payload.get("amount").toString());
            String paymentId = (String) payload.get("paymentId");

            Subscription newSub = subscriptionService.createSubscription(userId, planName, billingCycle, amount, paymentId);

            return ResponseEntity.ok(Map.of(
                "message", "Subscription active!",
                "status", newSub.getStatus(),
                "newPlan", newSub.getPlanName()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelSubscription(@RequestBody Map<String, Object> payload) {
        System.out.println("🔥 API Request: /subscriptions/cancel " + payload);
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            
            subscriptionService.cancelSubscription(userId);

            return ResponseEntity.ok(Map.of("message", "Subscription cancelled successfully."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Cancellation failed: " + e.getMessage()));
        }
    }
}