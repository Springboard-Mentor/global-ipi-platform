package com.example.demo.subscription.service.impl;

import com.example.demo.subscription.dto.SubscriptionRequest;
import com.example.demo.subscription.dto.SubscriptionResponse;
import com.example.demo.subscription.entity.Subscription;
import com.example.demo.subscription.repository.SubscriptionRepository;
import com.example.demo.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository repository;

    @Override
    public SubscriptionResponse subscribe(Long userId, SubscriptionRequest request) {
        if (!repository.existsByUserIdAndIpAssetId(userId, request.getIpAssetId())) {
            Subscription subscription = Subscription.builder()
                    .userId(userId)
                    .ipAssetId(request.getIpAssetId())
                    .build();
            subscription = repository.save(subscription);
            return toDto(subscription);
        } else {
            // Already exists -> return existing
            List<Subscription> list = repository.findByUserId(userId).stream()
                    .filter(s -> s.getIpAssetId().equals(request.getIpAssetId()))
                    .collect(Collectors.toList());
            return list.isEmpty() ? null : toDto(list.get(0));
        }
    }

    @Override
    public void unsubscribe(Long userId, Long ipAssetId) {
        repository.deleteByUserIdAndIpAssetId(userId, ipAssetId);
    }

    @Override
    public Page<SubscriptionResponse> listForUser(Long userId, Pageable pageable) {
        List<SubscriptionResponse> items = repository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), items.size());
        return new PageImpl<>(items.subList(start, end), pageable, items.size());
    }

    private SubscriptionResponse toDto(Subscription s) {
        SubscriptionResponse r = new SubscriptionResponse();
        r.setId(s.getId());
        r.setUserId(s.getUserId());
        r.setIpAssetId(s.getIpAssetId());
        r.setCreatedAt(s.getCreatedAt());
        return r;
    }
}
