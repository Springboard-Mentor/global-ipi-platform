package com.example.demo.filingtracker.controller;

import com.example.demo.filingtracker.dto.DashboardDto;
import com.example.demo.filingtracker.dto.FilingTrackerDto;
import com.example.demo.filingtracker.dto.TrackRequest;
import com.example.demo.filingtracker.service.FilingTrackerService;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/filing-tracker")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FilingTrackerController {

    private final FilingTrackerService service;
    private final UserRepository userRepository;

    @PostMapping("/track")
    public ResponseEntity<FilingTrackerDto> track(@Valid @RequestBody TrackRequest request,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = userDetails.getUsername();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElse(null);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        FilingTrackerDto dto = service.track(request, userId);
        // For debugging: log what status we are returning to the client
        if (dto != null) {
            System.out.println("[DEBUG] /api/filing-tracker/track -> returning status=" + dto.getCurrentStatus()
                    + " expiry=" + dto.getExpiryDate() + " grant=" + dto.getGrantDate());
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<FilingTrackerDto>> list(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = userDetails.getUsername();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElse(null);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(service.listForUser(userId));
    }

    @GetMapping("/my-filings")
    public ResponseEntity<List<FilingTrackerDto>> myFilings(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = userDetails.getUsername();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElse(null);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(service.listForUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FilingTrackerDto> getById(@PathVariable Long id,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = userDetails.getUsername();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElse(null);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        FilingTrackerDto dto = service.getById(id, userId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    // Dev-only helper: derive status for an application number using current logic
    // Usage: GET /api/filing-tracker/inspect?appNo=US11637746B2
    @GetMapping("/inspect")
    public ResponseEntity<?> inspect(@RequestParam String appNo) {
        // Dev helper: returns basic inspection info and instructs to check server logs.
        return ResponseEntity.ok(Map.of(
                "applicationNumber", appNo,
                "now", java.time.LocalDate.now().toString(),
                "note", "Use /api/filing-tracker/track and check server logs for detailed derived status"
        ));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> dashboard(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = userDetails.getUsername();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElse(null);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(service.dashboard(userId));
    }
}
