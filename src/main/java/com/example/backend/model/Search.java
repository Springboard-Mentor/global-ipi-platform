package com.example.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Search {

    private String keyword;
    private String ipType;
    private String jurisdiction;
    private String status;
    private String assignee;
}
