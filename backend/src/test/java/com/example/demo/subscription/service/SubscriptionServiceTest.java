package com.example.demo.subscription.service;

import com.example.demo.subscription.dto.SubscriptionRequest;
import com.example.demo.subscription.entity.Subscription;
import com.example.demo.subscription.repository.SubscriptionRepository;
import com.example.demo.subscription.service.impl.SubscriptionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class SubscriptionServiceTest {

    private SubscriptionRepository repository;
    private SubscriptionServiceImpl service;

    @BeforeEach
    void setup() {
        repository = Mockito.mock(SubscriptionRepository.class);
        service = new SubscriptionServiceImpl(repository);
    }

    @Test
    void subscribe_creates_when_not_exists() {
        when(repository.existsByUserIdAndIpAssetId(1L, 100L)).thenReturn(false);
        when(repository.save(any(Subscription.class))).thenAnswer(i -> {
            Subscription s = i.getArgument(0);
            s.setId(1L);
            return s;
        });

        SubscriptionRequest req = new SubscriptionRequest();
        req.setIpAssetId(100L);
        var resp = service.subscribe(1L, req);
        assertThat(resp).isNotNull();
        assertThat(resp.getId()).isEqualTo(1L);
        assertThat(resp.getIpAssetId()).isEqualTo(100L);
    }
}
