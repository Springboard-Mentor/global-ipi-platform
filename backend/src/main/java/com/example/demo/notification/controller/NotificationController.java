package com.example.demo.notification.controller;

import com.example.demo.notification.dto.NotificationRequest;
import com.example.demo.notification.dto.NotificationResponse;
import com.example.demo.notification.service.NotificationService;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;
    private final UserRepository userRepository;

    // Admin/system creates a notification for a user
    @PostMapping
    public ResponseEntity<NotificationResponse> create(@Valid @RequestBody NotificationRequest request) {
        // require either userId or ipAssetId to be set
        if (request.getUserId() == null && request.getIpAssetId() == null) {
            return ResponseEntity.badRequest().build();
        }
        NotificationResponse resp = service.create(request);
        return ResponseEntity.ok(resp);
    }

    // Broadcast notifications to all subscribers of an asset
    @PostMapping("/broadcast")
    public ResponseEntity<NotificationResponse> broadcast(@Valid @RequestBody NotificationRequest request) {
        NotificationResponse resp = service.createAndBroadcast(request);
        return ResponseEntity.ok(resp);
    }

    // List notifications for current user
    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> list(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "20") int size,
                                                            @RequestParam(defaultValue = "false") boolean unreadOnly,
                                                            Authentication auth) {
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElseThrow();
        Page<NotificationResponse> p = service.listForUser(userId, PageRequest.of(page, size), unreadOnly);
        return ResponseEntity.ok(p);
    }

    // Mark notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id, Authentication auth) {
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElseThrow();
        service.markAsRead(id, userId);
        return ResponseEntity.noContent().build();
    }
}
