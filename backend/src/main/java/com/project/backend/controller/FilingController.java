
package com.project.backend.controller;

import com.project.backend.entity.UserFiling;
import com.project.backend.repository.UserFilingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/api/filings")
@CrossOrigin(origins = "http://localhost:5173") // Matches your frontend port
public class FilingController {

    @Autowired
    private UserFilingRepository repository;

    @PostMapping
    public ResponseEntity<UserFiling> createFiling(@RequestBody UserFiling filing) {
        filing.setSubmissionDate(LocalDate.now()); // Sets today as the submission date
        UserFiling savedFiling = repository.save(filing);
        return ResponseEntity.ok(savedFiling);
    }

    @GetMapping
    public List<UserFiling> getAllFilings() {
        return repository.findAll();
    }
}