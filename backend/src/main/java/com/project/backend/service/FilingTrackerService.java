package com.project.backend.service;

import com.project.backend.entity.IPAsset;
import com.project.backend.entity.User;
import com.project.backend.entity.UserFiling;
import com.project.backend.repository.IPAssetRepository;
import com.project.backend.repository.UserFilingRepository;
import com.project.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FilingTrackerService {

    @Autowired private UserFilingRepository userFilingRepository;
    @Autowired private IPAssetRepository ipAssetRepository;
    @Autowired private UserRepository userRepository;

    /**
     * ✅ FETCH ALL: Returns the shared watchlist
     */
    public List<UserFiling> getAllFilings() {
        return userFilingRepository.findAllByOrderBySubmissionDateDesc();
    }

    /**
     * ✅ UPDATE STATUS: Updates the status of a filing
     */
    @Transactional
    public UserFiling updateStatus(Long filingId, String newStatus) {
        UserFiling filing = userFilingRepository.findById(filingId)
            .orElseThrow(() -> new RuntimeException("Filing not found with ID: " + filingId));
        
        filing.setStatus(newStatus);
        
        return userFilingRepository.save(filing);
    }

    /**
     * ✅ CREATE: Manually add a new filing
     */
    @Transactional
    public UserFiling createFiling(UserFiling filing) {
        // 1. Resolve User ID from Email
        if (filing.getEmail() != null && !filing.getEmail().isEmpty()) {
            User user = userRepository.findByEmail(filing.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + filing.getEmail()));
            filing.setUserId(user.getId());
        }

        // 2. Set Defaults
        if (filing.getSubmissionDate() == null) {
            filing.setSubmissionDate(LocalDate.now());
        }
        
        if (filing.getPatentStatus() == null || filing.getPatentStatus().isEmpty()) {
            filing.setPatentStatus("Pending");
        }
        
        if (filing.getStatus() == null) {
            filing.setStatus("PENDING");
        }

        return userFilingRepository.save(filing);
    }

    /**
     * ✅ TRACK: Adds to the shared list from IP Assets
     */
    @Transactional
    public UserFiling trackAsset(String userEmail, Integer assetId) {
        // 1. Get the Asset
        IPAsset asset = ipAssetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        // 2. Get the User ID from the Email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        // 3. Check for duplicates using Patent Number
        Optional<UserFiling> existing = userFilingRepository.findByPatentNumber(asset.getAssetNumber());
        if (existing.isPresent()) {
            return existing.get();
        }

        // 4. Create new Filing
        UserFiling newFiling = new UserFiling();
        newFiling.setUserId(user.getId()); 
        newFiling.setEmail(userEmail);    
        newFiling.setTitle(asset.getTitle());
        newFiling.setPatentNumber(asset.getAssetNumber());
        newFiling.setCategory(asset.getAssetClass());
        newFiling.setFilingType(asset.getType());
        newFiling.setAssignee(asset.getAssignee());
        newFiling.setJurisdiction(asset.getJurisdiction());
        newFiling.setPatentStatus(asset.getStatus());
        newFiling.setDescription(asset.getDetails());
        
        if (asset.getFilingDate() != null) {
            newFiling.setFilingDate(asset.getFilingDate().toLocalDate());
        }
        newFiling.setSubmissionDate(LocalDate.now());
        newFiling.setTags("TRACKED");
        newFiling.setStatus("TRACKED");

        return userFilingRepository.save(newFiling);
    }

    /**
     * ✅ NEW: DELETE A FILING
     */
    @Transactional
    public void deleteFiling(Long id) {
        if (userFilingRepository.existsById(id)) {
            userFilingRepository.deleteById(id);
        } else {
            throw new RuntimeException("Filing not found with ID: " + id);
        }
    }
}