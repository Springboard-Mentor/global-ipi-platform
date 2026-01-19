package com.example.demo.admin.dto;

import lombok.Data;
import java.util.List;

@Data
public class BulkActionRequest {
    private List<Long> ids;
    private String action; // "DELETE", "UPDATE_STATUS"
    private String value; // e.g. "APPROVED" if action is UPDATE_STATUS
}
