package com.example.demo.filing.controller;

import com.example.demo.filing.dto.PatentFilingRequest;
import com.example.demo.filing.dto.PatentFilingResponse;
import com.example.demo.filing.service.PatentFilingService;
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
@RequestMapping("/api/patent-filings")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PatentFilingController {

    private final PatentFilingService filingService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createFiling(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PatentFilingRequest request) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required. Please log in to submit a patent filing."));
            }

            String email = userDetails.getUsername();
            Long userId = userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

            PatentFilingResponse response = filingService.createFiling(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            String message = e.getMessage() != null ? e.getMessage() : "Error occurred: " + e.getClass().getSimpleName();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", message));
        }
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleJsonParseException(org.springframework.http.converter.HttpMessageNotReadableException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Invalid Request Data: " + e.getMessage()));
    }

    @GetMapping
    public ResponseEntity<?> getAllFilings(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
            }

            String email = userDetails.getUsername();
            Long userId = userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

            List<PatentFilingResponse> filings = filingService.getAllFilingsByUserId(userId);
            return ResponseEntity.ok(filings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFilingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
            }

            String email = userDetails.getUsername();
            Long userId = userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

            PatentFilingResponse filing = filingService.getFilingById(id, userId);
            return ResponseEntity.ok(filing);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFiling(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PatentFilingRequest request) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
            }

            String email = userDetails.getUsername();
            Long userId = userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

            PatentFilingResponse response = filingService.updateFiling(id, userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFiling(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
            }

            String email = userDetails.getUsername();
            Long userId = userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

            filingService.deleteFiling(id, userId);
            return ResponseEntity.ok(Map.of("message", "Filing deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
}
