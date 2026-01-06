package com.example.demo.subscription.controller;

import com.example.demo.subscription.dto.SubscriptionRequest;
import com.example.demo.subscription.dto.SubscriptionResponse;
import com.example.demo.subscription.service.SubscriptionService;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService service;
    private final UserRepository userRepository;

    // POST /api/subscriptions { ipAssetId }
    @PostMapping
    public ResponseEntity<SubscriptionResponse> subscribe(@Valid @RequestBody SubscriptionRequest request, Authentication auth) {
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElseThrow();
        SubscriptionResponse resp = service.subscribe(userId, request);
        return ResponseEntity.ok(resp);
    }

    // DELETE /api/subscriptions/{ipAssetId}
    @DeleteMapping("/{ipAssetId}")
    public ResponseEntity<Void> unsubscribe(@PathVariable Long ipAssetId, Authentication auth) {
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElseThrow();
        service.unsubscribe(userId, ipAssetId);
        return ResponseEntity.noContent().build();
    }

    // GET /api/subscriptions?page=0&size=20
    @GetMapping
    public ResponseEntity<Page<SubscriptionResponse>> list(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, Authentication auth) {
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElseThrow();
        Page<SubscriptionResponse> p = service.listForUser(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(p);
    }
}
