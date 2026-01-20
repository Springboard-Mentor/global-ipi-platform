package com.example.demo.admin.dto;

import lombok.Data;
import java.util.List;

@Data
public class FeedbackRequest {
    private String feedback;
    private List<String> requestedFields;
}
