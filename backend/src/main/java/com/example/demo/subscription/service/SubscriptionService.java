package com.example.demo.subscription.service;

import com.example.demo.subscription.dto.SubscriptionRequest;
import com.example.demo.subscription.dto.SubscriptionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubscriptionService {
    SubscriptionResponse subscribe(Long userId, SubscriptionRequest request);
    void unsubscribe(Long userId, Long ipAssetId);
    Page<SubscriptionResponse> listForUser(Long userId, Pageable pageable);
}
