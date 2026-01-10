package com.project.backend.controller;

import com.project.backend.entity.IPAsset;
import com.project.backend.entity.UserFiling;
import com.project.backend.repository.IPAssetRepository;
import com.project.backend.repository.UserFilingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/filings")
@CrossOrigin(origins = "http://localhost:5173")
public class FilingController {

    @Autowired
    private UserFilingRepository repository;

    @Autowired
    private IPAssetRepository ipAssetRepository;

    @PostMapping
    public ResponseEntity<UserFiling> createFiling(@RequestBody UserFiling filing) {
        filing.setSubmissionDate(LocalDate.now());
        UserFiling savedFiling = repository.save(filing);

        IPAsset dashboardAsset = new IPAsset();
        dashboardAsset.setTitle(filing.getTitle());
        dashboardAsset.setAssetNumber("APP-" + System.currentTimeMillis()); 
        dashboardAsset.setType("PATENT"); 
        dashboardAsset.setStatus("PENDING"); 
        dashboardAsset.setAssignee(filing.getAssignee());
        dashboardAsset.setJurisdiction(filing.getJurisdiction());
        
        if (filing.getFilingDate() != null) {
            dashboardAsset.setFilingDate(filing.getFilingDate().atStartOfDay());
        } else {
            dashboardAsset.setFilingDate(LocalDate.now().atStartOfDay());
        }

        dashboardAsset.setDetails(filing.getDescription());
        dashboardAsset.setAssetClass(filing.getCategory()); 
        dashboardAsset.setInventor(filing.getInventorName());

        ipAssetRepository.save(dashboardAsset);

        return ResponseEntity.ok(savedFiling);
    }

    @GetMapping
    public List<UserFiling> getAllFilings() {
        return repository.findAll();
    }
}