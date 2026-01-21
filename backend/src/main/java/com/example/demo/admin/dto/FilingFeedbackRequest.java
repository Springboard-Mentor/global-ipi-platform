package com.example.demo.admin.dto;

import java.util.List;
import lombok.Data;

@Data
public class FilingFeedbackRequest {
    private String feedback;
    private List<String> requestedFields;
}
