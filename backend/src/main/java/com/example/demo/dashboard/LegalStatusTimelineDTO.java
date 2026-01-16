package com.example.demo.dashboard;

import java.time.LocalDate;

public record LegalStatusTimelineDTO(
        String status,
        LocalDate eventDate,
        String country,
        String source
) {}

