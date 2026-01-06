package com.example.demo.subscription.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubscriptionResponse {
    private Long id;
    private Long userId;
    private Long ipAssetId;
    private LocalDateTime createdAt;
}
