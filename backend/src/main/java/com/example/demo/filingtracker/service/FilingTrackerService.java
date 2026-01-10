package com.example.demo.filingtracker.service;

import com.example.demo.filingtracker.dto.FilingTrackerDto;
import com.example.demo.filingtracker.dto.TrackRequest;
import com.example.demo.filingtracker.dto.DashboardDto;

import java.util.List;

public interface FilingTrackerService {
    FilingTrackerDto track(TrackRequest request, Long userId);
    List<FilingTrackerDto> listForUser(Long userId);
    DashboardDto dashboard(Long userId);
    FilingTrackerDto getById(Long id, Long userId);
}
