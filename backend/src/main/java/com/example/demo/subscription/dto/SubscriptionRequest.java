package com.example.demo.subscription.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscriptionRequest {
    @NotNull
    private Long ipAssetId;
}
