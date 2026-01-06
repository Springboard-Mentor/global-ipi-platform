package com.example.demo.notification.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private Long userId;
    private Long ipAssetId;
    private String message;
    private String type;
    private LocalDateTime timestamp;
    private boolean read;
}
