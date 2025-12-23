package com.example.demo.ip.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class IPSearchRequest {
    private String query; // search keyword
    private String type; // PATENT or TRADEMARK
    private String source;  // LOCAL or EXTERNAL

}
