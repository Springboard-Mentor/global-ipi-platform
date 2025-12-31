package com.project.backend.controller;

import com.project.backend.service.SubscriptionService;
import com.project.backend.service.NotificationService;
import com.project.backend.entity.Subscription;
import com.project.backend.entity.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:5173") // Connects to your frontend
public class SubscriptionController {
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/subscribe")
    public ResponseEntity<Subscription> addSubscription(@RequestParam Integer userId, @RequestParam Integer assetId) {
        return ResponseEntity.ok(subscriptionService.subscribe(userId, assetId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Subscription>> getSubscriptions(@PathVariable Integer userId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptions(userId));
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Integer userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }
}