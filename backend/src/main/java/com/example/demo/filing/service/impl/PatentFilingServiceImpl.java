package com.example.demo.filing.service.impl;

import com.example.demo.filing.dto.PatentFilingRequest;
import com.example.demo.filing.dto.PatentFilingResponse;
import com.example.demo.filing.entity.Inventor;
import com.example.demo.filing.entity.PatentFiling;
import com.example.demo.filing.repository.InventorRepository;
import com.example.demo.filing.repository.PatentFilingRepository;
import com.example.demo.filing.service.PatentFilingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatentFilingServiceImpl implements PatentFilingService {

    private final PatentFilingRepository filingRepository;
    private final InventorRepository inventorRepository;
    private final com.example.demo.monitoring.MonitoringService monitoringService;

    @Override
    @Transactional
    public PatentFilingResponse createFiling(Long userId, PatentFilingRequest request) {
        PatentFiling filing = new PatentFiling();
        
        // Set user ID
        filing.setUserId(userId);
        
        // Map applicant details
        filing.setApplicantName(request.getApplicantName());
        filing.setApplicantType(request.getApplicantType());
        filing.setNationality(request.getNationality());
        filing.setAddressStreet(request.getAddressStreet());
        filing.setAddressCity(request.getAddressCity());
        filing.setAddressState(request.getAddressState());
        filing.setAddressPostalCode(request.getAddressPostalCode());
        filing.setCorrespondenceSame(request.getCorrespondenceSame() != null ? request.getCorrespondenceSame() : true);
        filing.setCorrespondenceStreet(request.getCorrespondenceStreet());
        filing.setCorrespondenceCity(request.getCorrespondenceCity());
        filing.setCorrespondenceState(request.getCorrespondenceState());
        filing.setCorrespondencePostalCode(request.getCorrespondencePostalCode());
        filing.setEmail(request.getEmail());
        filing.setPhone(request.getPhone());
        filing.setFilingRole(request.getFilingRole());
        filing.setIsInventor(request.getIsInventor() != null ? request.getIsInventor() : true);
        filing.setIdType(request.getIdType());
        filing.setIdNumber(request.getIdNumber());
        
        // Map patent details
        filing.setPatentType(request.getPatentType());
        filing.setJurisdiction(request.getJurisdiction());
        filing.setTechnicalField(request.getTechnicalField());
        filing.setTitle(request.getTitle());
        filing.setAbstractText(request.getAbstractText());
        filing.setProblemStatement(request.getProblemStatement());
        filing.setNovelty(request.getNovelty());
        filing.setPriorityClaim(request.getPriorityClaim() != null ? request.getPriorityClaim() : false);
        filing.setPriorityApplicationNumber(request.getPriorityApplicationNumber());
        if (request.getPriorityDate() != null && !request.getPriorityDate().isEmpty()) {
            filing.setPriorityDate(LocalDate.parse(request.getPriorityDate()));
        }
        
        // Map file paths
        filing.setSpecificationFilePath(request.getSpecificationFilePath());
        filing.setClaimsFilePath(request.getClaimsFilePath());
        if (request.getDrawingsFilePaths() != null) {
            filing.setDrawingsFilePaths(request.getDrawingsFilePaths());
        }
        
        // Map inventors
        if (request.getInventors() != null && !request.getInventors().isEmpty()) {
            List<Inventor> inventors = request.getInventors().stream()
                .map(invReq -> {
                    Inventor inventor = inventorRepository.findByName(invReq.getName())
                        .orElse(new Inventor());
                    inventor.setName(invReq.getName());
                    return inventorRepository.save(inventor);
                })
                .collect(Collectors.toList());
            filing.setInventors(inventors);
        }
        
        // Map payment details
        filing.setPaymentMethod(request.getPaymentMethod());
        filing.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "unpaid");
        filing.setTotalFee(request.getTotalFee());
        
        // Save filing
        PatentFiling savedFiling = filingRepository.save(filing);
        
        // Compute status
        savedFiling.setStatus(computeStatus(savedFiling));
        savedFiling = filingRepository.save(savedFiling);
        
        return mapToResponse(savedFiling);
    }

    @Override
    public PatentFilingResponse getFilingById(Long id, Long userId) {
        monitoringService.recordPatentView();
        PatentFiling filing = filingRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new RuntimeException("Filing not found"));
        return mapToResponse(filing);
    }

    @Override
    public List<PatentFilingResponse> getAllFilingsByUserId(Long userId) {
        List<PatentFiling> filings = filingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return filings.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PatentFilingResponse updateFiling(Long id, Long userId, PatentFilingRequest request) {
        PatentFiling filing = filingRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new RuntimeException("Filing not found"));
        
        // Update fields (similar to create, but update existing)
        filing.setApplicantName(request.getApplicantName());
        filing.setApplicantType(request.getApplicantType());
        filing.setNationality(request.getNationality());
        filing.setAddressStreet(request.getAddressStreet());
        filing.setAddressCity(request.getAddressCity());
        filing.setAddressState(request.getAddressState());
        filing.setAddressPostalCode(request.getAddressPostalCode());
        if (request.getCorrespondenceSame() != null) {
            filing.setCorrespondenceSame(request.getCorrespondenceSame());
        }
        filing.setCorrespondenceStreet(request.getCorrespondenceStreet());
        filing.setCorrespondenceCity(request.getCorrespondenceCity());
        filing.setCorrespondenceState(request.getCorrespondenceState());
        filing.setCorrespondencePostalCode(request.getCorrespondencePostalCode());
        filing.setEmail(request.getEmail());
        filing.setPhone(request.getPhone());
        filing.setFilingRole(request.getFilingRole());
        if (request.getIsInventor() != null) {
            filing.setIsInventor(request.getIsInventor());
        }
        filing.setIdType(request.getIdType());
        filing.setIdNumber(request.getIdNumber());
        
        filing.setPatentType(request.getPatentType());
        filing.setJurisdiction(request.getJurisdiction());
        filing.setTechnicalField(request.getTechnicalField());
        filing.setTitle(request.getTitle());
        filing.setAbstractText(request.getAbstractText());
        filing.setProblemStatement(request.getProblemStatement());
        filing.setNovelty(request.getNovelty());
        if (request.getPriorityClaim() != null) {
            filing.setPriorityClaim(request.getPriorityClaim());
        }
        filing.setPriorityApplicationNumber(request.getPriorityApplicationNumber());
        if (request.getPriorityDate() != null && !request.getPriorityDate().isEmpty()) {
            filing.setPriorityDate(LocalDate.parse(request.getPriorityDate()));
        }
        
        if (request.getSpecificationFilePath() != null) {
            filing.setSpecificationFilePath(request.getSpecificationFilePath());
        }
        if (request.getClaimsFilePath() != null) {
            filing.setClaimsFilePath(request.getClaimsFilePath());
        }
        if (request.getDrawingsFilePaths() != null) {
            filing.setDrawingsFilePaths(request.getDrawingsFilePaths());
        }
        
        // Update inventors
        if (request.getInventors() != null && !request.getInventors().isEmpty()) {
            filing.getInventors().clear();
            List<Inventor> inventors = request.getInventors().stream()
                .map(invReq -> {
                    Inventor inventor = inventorRepository.findByName(invReq.getName())
                        .orElse(new Inventor());
                    inventor.setName(invReq.getName());
                    return inventorRepository.save(inventor);
                })
                .collect(Collectors.toList());
            filing.setInventors(inventors);
        }
        
        if (request.getPaymentMethod() != null) {
            filing.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getPaymentStatus() != null) {
            filing.setPaymentStatus(request.getPaymentStatus());
        }
        if (request.getTotalFee() != null) {
            filing.setTotalFee(request.getTotalFee());
        }
        
        // If it was Pending Response, it's now back to Under Review after user update
        if ("Pending Response".equalsIgnoreCase(filing.getStatus())) {
            filing.setStatus("Under Review");
            filing.getRequestedUpdateFields().clear();
        } else {
            filing.setStatus(computeStatus(filing));
        }
        
        PatentFiling updatedFiling = filingRepository.save(filing);
        return mapToResponse(updatedFiling);
    }

    @Override
    @Transactional
    public void deleteFiling(Long id, Long userId) {
        PatentFiling filing = filingRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new RuntimeException("Filing not found"));
        filingRepository.delete(filing);
    }

    @Override
    public PatentFilingResponse getFilingByIdAdmin(Long id) {
        monitoringService.recordPatentView();
        PatentFiling filing = filingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Filing not found"));
        return mapToResponse(filing);
    }

    @Override
    public List<PatentFilingResponse> getAllFilingsAdmin() {
        return filingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PatentFilingResponse updateFilingStatusAdmin(Long id, String status) {
        PatentFiling filing = filingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filing not found"));
        
        filing.setStatus(status);
        
        // precise handling for GRANTED
        if ("GRANTED".equalsIgnoreCase(status)) {
            if (filing.getGrantDate() == null) {
                filing.setGrantDate(LocalDate.now());
            }
        }
        
        filingRepository.save(filing);
        return mapToResponse(filing);
    }
    
    @Override
    @Transactional
    public PatentFilingResponse updateFilingFeedbackAdmin(Long id, String feedback, List<String> requestedFields) {
        PatentFiling filing = filingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filing not found"));
        filing.setAdminFeedback(feedback);
        
        if (requestedFields != null) {
            filing.getRequestedUpdateFields().clear();
            filing.getRequestedUpdateFields().addAll(requestedFields);
            
            // If fields are requested, move status to "Pending Response" if it's not already something else critical
            if (!"GRANTED".equalsIgnoreCase(filing.getStatus()) && !"REJECTED".equalsIgnoreCase(filing.getStatus())) {
                filing.setStatus("Pending Response");
            }
        }
        
        filingRepository.save(filing);
        return mapToResponse(filing);
    }

    @Override
    @Transactional
    public PatentFilingResponse updateFilingFeedbackAdmin(Long id, String feedback) {
        return updateFilingFeedbackAdmin(id, feedback, null);
    }

    @Override
    @Transactional
    public void performBulkAction(List<Long> ids, String action, String value) {
        if (ids == null || ids.isEmpty()) return;

        List<PatentFiling> filings = filingRepository.findAllById(ids);
        
        for (PatentFiling f : filings) {
            if ("DELETE".equalsIgnoreCase(action)) {
                filingRepository.delete(f);
            } else if ("UPDATE_STATUS".equalsIgnoreCase(action)) {
                f.setStatus(value);
                 // precise handling for GRANTED
                if ("GRANTED".equalsIgnoreCase(value)) {
                    if (f.getGrantDate() == null) {
                        f.setGrantDate(LocalDate.now());
                    }
                }
                filingRepository.save(f);
            }
        }
    }

    @Override
    public String computeStatus(PatentFilingResponse filing) {
        // This method relies on the DTO. Logic mirrors the entity method.
        if (filing.getGrantDate() != null) {
            return "GRANTED";
        }
        
        // Preserve manual statuses if present in the specific flow
        String current = filing.getStatus();
        if (isManualStatus(current)) {
            return current;
        }

        LocalDate now = LocalDate.now();
        if (filing.getExpiryDate() != null) {
            if (now.isAfter(filing.getExpiryDate())) {
                return "EXPIRED";
            }
            
            LocalDate sixMonthsFromNow = now.plusMonths(6);
            if (filing.getExpiryDate().isBefore(sixMonthsFromNow) || 
                filing.getExpiryDate().isEqual(sixMonthsFromNow)) {
                return "EXPIRING SOON";
            }
        }
        
        return "FILED";
    }
    
    private String computeStatus(PatentFiling filing) {
        if (filing.getGrantDate() != null) {
            return "GRANTED";
        }

        // Preserve manual intermediate statuses
        String current = filing.getStatus();
        if (isManualStatus(current)) {
            return current;
        }

        LocalDate now = LocalDate.now();
        if (filing.getExpiryDate() != null) {
            if (now.isAfter(filing.getExpiryDate())) {
                return "EXPIRED";
            }
            
            LocalDate sixMonthsFromNow = now.plusMonths(6);
            if (filing.getExpiryDate().isBefore(sixMonthsFromNow) || 
                filing.getExpiryDate().isEqual(sixMonthsFromNow)) {
                return "EXPIRING SOON";
            }
        }
        
        return "FILED";
    }
    
    private boolean isManualStatus(String status) {
        if (status == null) return false;
        return status.equalsIgnoreCase("Under Examination") || 
               status.equalsIgnoreCase("Under Review") ||
               status.equalsIgnoreCase("Pending Response") || 
               status.equalsIgnoreCase("APPROVED") || 
               status.equalsIgnoreCase("REJECTED") || 
               status.equalsIgnoreCase("Withdrawn");
    }
    
    private PatentFilingResponse mapToResponse(PatentFiling filing) {
        PatentFilingResponse response = new PatentFilingResponse();
        
        response.setId(filing.getId());
        response.setUserId(filing.getUserId());
        
        // Applicant details
        response.setApplicantName(filing.getApplicantName());
        response.setApplicantType(filing.getApplicantType());
        response.setNationality(filing.getNationality());
        response.setAddressStreet(filing.getAddressStreet());
        response.setAddressCity(filing.getAddressCity());
        response.setAddressState(filing.getAddressState());
        response.setAddressPostalCode(filing.getAddressPostalCode());
        response.setCorrespondenceSame(filing.getCorrespondenceSame());
        response.setCorrespondenceStreet(filing.getCorrespondenceStreet());
        response.setCorrespondenceCity(filing.getCorrespondenceCity());
        response.setCorrespondenceState(filing.getCorrespondenceState());
        response.setCorrespondencePostalCode(filing.getCorrespondencePostalCode());
        response.setEmail(filing.getEmail());
        response.setPhone(filing.getPhone());
        response.setFilingRole(filing.getFilingRole());
        response.setIsInventor(filing.getIsInventor());
        response.setIdType(filing.getIdType());
        response.setIdNumber(filing.getIdNumber());
        
        // Patent details
        response.setPatentType(filing.getPatentType());
        response.setJurisdiction(filing.getJurisdiction());
        response.setTechnicalField(filing.getTechnicalField());
        response.setTitle(filing.getTitle());
        response.setAbstractText(filing.getAbstractText());
        response.setProblemStatement(filing.getProblemStatement());
        response.setNovelty(filing.getNovelty());
        response.setPriorityClaim(filing.getPriorityClaim());
        response.setPriorityApplicationNumber(filing.getPriorityApplicationNumber());
        response.setPriorityDate(filing.getPriorityDate());
        
        // Inventors
        if (filing.getInventors() != null) {
            response.setInventors(filing.getInventors().stream()
                .map(inv -> {
                    PatentFilingResponse.InventorResponse invResp = new PatentFilingResponse.InventorResponse();
                    invResp.setId(inv.getId());
                    invResp.setName(inv.getName());
                    return invResp;
                })
                .collect(Collectors.toList()));
        }
        
        // File paths
        response.setSpecificationFilePath(filing.getSpecificationFilePath());
        response.setClaimsFilePath(filing.getClaimsFilePath());
        response.setDrawingsFilePaths(filing.getDrawingsFilePaths());
        
        // Payment details
        response.setPaymentMethod(filing.getPaymentMethod());
        response.setPaymentStatus(filing.getPaymentStatus());
        response.setTotalFee(filing.getTotalFee());
        
        // Metadata
        response.setApplicationNumber(filing.getApplicationNumber());
        response.setFilingDate(filing.getFilingDate());
        response.setExpiryDate(filing.getExpiryDate());
        response.setGrantDate(filing.getGrantDate());
        response.setStatus(computeStatus(filing));
        
        response.setCreatedAt(filing.getCreatedAt());
        response.setUpdatedAt(filing.getUpdatedAt());
        response.setAdminFeedback(filing.getAdminFeedback());
        response.setRequestedUpdateFields(new java.util.ArrayList<>(filing.getRequestedUpdateFields()));
        
        return response;
    }
}
