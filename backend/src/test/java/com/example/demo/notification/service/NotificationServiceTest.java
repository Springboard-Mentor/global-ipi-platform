package com.example.demo.notification.service;

import com.example.demo.notification.dto.NotificationRequest;
import com.example.demo.notification.entity.Notification;
import com.example.demo.notification.repository.NotificationRepository;
import com.example.demo.notification.service.impl.NotificationServiceImpl;
import com.example.demo.subscription.entity.Subscription;
import com.example.demo.subscription.repository.SubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class NotificationServiceTest {

    private NotificationRepository notificationRepository;
    private SubscriptionRepository subscriptionRepository;
    private NotificationServiceImpl service;

    @BeforeEach
    void setup() {
        notificationRepository = Mockito.mock(NotificationRepository.class);
        subscriptionRepository = Mockito.mock(SubscriptionRepository.class);
        service = new NotificationServiceImpl(notificationRepository, subscriptionRepository);
    }

    @Test
    void createAndBroadcast_sends_to_all_subscribers() {
        Subscription s1 = Subscription.builder().id(1L).userId(10L).ipAssetId(100L).build();
        Subscription s2 = Subscription.builder().id(2L).userId(11L).ipAssetId(100L).build();
        when(subscriptionRepository.findByIpAssetId(100L)).thenReturn(List.of(s1, s2));

        NotificationRequest req = new NotificationRequest();
        req.setIpAssetId(100L);
        req.setMessage("Test");

        service.createAndBroadcast(req);

        verify(notificationRepository, times(2)).save(any(Notification.class));
    }
}
