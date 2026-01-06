package com.example.demo.notification.service.impl;

import com.example.demo.notification.dto.NotificationRequest;
import com.example.demo.notification.dto.NotificationResponse;
import com.example.demo.notification.entity.Notification;
import com.example.demo.notification.repository.NotificationRepository;
import com.example.demo.notification.service.NotificationService;
import com.example.demo.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;
    private final SubscriptionRepository subscriptionRepository;

    @Override
    public NotificationResponse create(NotificationRequest request) {
        // Single notification for a single user
        Notification n = Notification.builder()
                .userId(request.getUserId())
                .ipAssetId(request.getIpAssetId())
                .message(request.getMessage())
                .type(request.getType())
                .read(false)
                .build();
        n = repository.save(n);
        return toDto(n);
    }

    @Override
    public NotificationResponse createAndBroadcast(NotificationRequest request) {
        // If ipAssetId set and userId is null -> broadcast to subscribers
        if (request.getIpAssetId() != null && request.getUserId() == null) {
            var subs = subscriptionRepository.findByIpAssetId(request.getIpAssetId());
            // create for each subscriber
            for (var s : subs) {
                Notification n = Notification.builder()
                        .userId(s.getUserId())
                        .ipAssetId(s.getIpAssetId())
                        .message(request.getMessage())
                        .type(request.getType())
                        .read(false)
                        .build();
                repository.save(n);
            }
            // return a simple response for the broadcast request
            NotificationResponse resp = new NotificationResponse();
            resp.setMessage("Broadcast sent to " + subs.size() + " subscribers");
            return resp;
        }
        // Otherwise behave like create()
        return create(request);
    }

    @Override
    public Page<NotificationResponse> listForUser(Long userId, Pageable pageable, boolean onlyUnread) {
        Page<Notification> page = onlyUnread ? repository.findByUserIdAndReadFalseOrderByTimestampDesc(userId, pageable) : repository.findByUserIdOrderByTimestampDesc(userId, pageable);
        return new PageImpl<>(page.getContent().stream().map(this::toDto).collect(Collectors.toList()), pageable, page.getTotalElements());
    }

    @Override
    public void markAsRead(Long notificationId, Long userId) {
        repository.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setRead(true);
                repository.save(n);
            }
        });
    }

    private NotificationResponse toDto(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.setId(n.getId());
        r.setUserId(n.getUserId());
        r.setIpAssetId(n.getIpAssetId());
        r.setMessage(n.getMessage());
        r.setType(n.getType());
        r.setTimestamp(n.getTimestamp());
        r.setRead(n.isRead());
        return r;
    }
}
