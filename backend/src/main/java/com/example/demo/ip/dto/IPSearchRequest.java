package com.example.demo.ip.dto;

import lombok.Data;

@Data
public class IPSearchRequest {
    private String query; // search keyword
    private String type; // PATENT or TRADEMARK

}
