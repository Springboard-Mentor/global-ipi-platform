package com.example.demo.notification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NotificationRequest {
    private Long userId;

    private Long ipAssetId;

    @NotBlank
    private String message;

    private String type;
}
