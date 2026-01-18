package com.example.demo.filingtracker.service.impl;

import com.example.demo.filingtracker.dto.DashboardDto;
import com.example.demo.filingtracker.dto.FilingTrackerDto;
import com.example.demo.filingtracker.dto.TrackRequest;
import com.example.demo.filingtracker.entity.FilingTracker;
import com.example.demo.filingtracker.repository.FilingTrackerRepository;
import com.example.demo.filingtracker.service.FilingTrackerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FilingTrackerServiceImpl implements FilingTrackerService {

    private final FilingTrackerRepository repository;

    @Override
    public FilingTrackerDto track(TrackRequest request, Long userId) {
        // Log incoming request for debugging
        log.debug("track() called userId={} applicationNumber={} filing={}, priority={}, pub={}, grant={}",
            userId, request.getApplicationNumber(), request.getFilingDate(), request.getPriorityDate(), request.getPublicationDate(), request.getGrantDate());
        // Prevent duplicate tracking per user + application number
        String appNo = request.getApplicationNumber();
        if (appNo != null) {
            var existingOpt = repository.findByUserIdAndApplicationNumber(userId, appNo);
            if (existingOpt.isPresent()) {
                // If an entry already exists, we may need to update it with
                // additional information from the incoming request (e.g. a grantDate)
                // rather than silently returning the old row which may be stale.
                FilingTracker existing = existingOpt.get();

                LocalDate existingFiling = existing.getFilingDate();
                LocalDate existingGrant = existing.getGrantDate();

                LocalDate incomingFiling = request.getFilingDate();
                LocalDate incomingGrant = request.getGrantDate();
                LocalDate incomingPriority = request.getPriorityDate();
                LocalDate incomingPub = request.getPublicationDate();

                // Compute expiry using incoming or existing dates (20 years standard)
                LocalDate filingDateForExpiry = incomingFiling != null ? incomingFiling : existingFiling;
                LocalDate expiry = filingDateForExpiry != null ? filingDateForExpiry.plusYears(20)
                        : (incomingGrant != null ? incomingGrant.plusYears(20)
                        : (existingGrant != null ? existingGrant.plusYears(20) : null));

                // Derive status using the same rules as when creating a new tracker:
                // 1) If grantDate is present => GRANTED
                // 2) Else if expiry is before today => EXPIRED
                // 3) Otherwise => FILED
                String derivedStatus;
                if (incomingGrant != null) {
                    derivedStatus = "GRANTED";
                } else if ((expiry != null) && expiry.isBefore(LocalDate.now())) {
                    derivedStatus = "EXPIRED";
                } else {
                    derivedStatus = "FILED";
                }

                boolean changed = false;

                // If incoming provides filingDate or we previously lacked it, update
                if (incomingFiling != null && (existingFiling == null || !incomingFiling.equals(existingFiling))) {
                    existing.setFilingDate(incomingFiling);
                    changed = true;
                }

                // Update Priority Date
                if (incomingPriority != null && (existing.getPriorityDate() == null || !incomingPriority.equals(existing.getPriorityDate()))) {
                    existing.setPriorityDate(incomingPriority);
                    changed = true;
                }

                // Update Publication Date
                if (incomingPub != null && (existing.getPublicationDate() == null || !incomingPub.equals(existing.getPublicationDate()))) {
                    existing.setPublicationDate(incomingPub);
                    changed = true;
                }

                // If incoming provides grantDate and it's different, update it
                if (incomingGrant != null && (existingGrant == null || !incomingGrant.equals(existingGrant))) {
                    existing.setGrantDate(incomingGrant);
                    changed = true;
                }

                // Always ensure expiry/renewal are up-to-date when we have dates
                if (expiry != null && (existing.getExpiryDate() == null || !expiry.equals(existing.getExpiryDate()))) {
                    existing.setExpiryDate(expiry);
                    existing.setRenewalDate(expiry.minusMonths(6));
                    changed = true;
                }

                // Update currentStatus if derived differs from stored
                if (derivedStatus != null && !derivedStatus.equals(existing.getCurrentStatus())) {
                    existing.setCurrentStatus(derivedStatus);
                    changed = true;
                }

                if (changed) {
                    existing = repository.save(existing);
                }

                return toDto(existing);
            }
        }

        LocalDate filingDate = request.getFilingDate();
        LocalDate grantDate = request.getGrantDate();
        LocalDate priorityDate = request.getPriorityDate();
        LocalDate publicationDate = request.getPublicationDate();

        // Compute expiry date: patents run for 20 years from filing date.
        // If filing date is not provided, fall back to grant date to compute expiry.
        LocalDate expiry = null;
        if (filingDate != null) {
            expiry = filingDate.plusYears(20);
        } else if (grantDate != null) {
            expiry = grantDate.plusYears(20);
        }

        // Renewal window (6 months before expiry) when expiry is known
        LocalDate renewal = expiry != null ? expiry.minusMonths(6) : null;

        // Derive current status immediately using the same rules used for IP search caching:
        // 1) If grantDate is present => GRANTED
        // 2) Else if expiry is before today => EXPIRED
        // 3) Otherwise => FILED
        String currentStatus;
        if (grantDate != null) {
            currentStatus = "GRANTED";
        } else if (expiry != null && expiry.isBefore(LocalDate.now())) {
            currentStatus = "EXPIRED";
        } else {
            currentStatus = "FILED";
        }

        FilingTracker f = FilingTracker.builder()
                .userId(userId)
                .userId(userId)
                .title(request.getTitle())
                .abstractText(request.getAbstractText())
                .inventors(request.getInventors())
                .assignee(request.getAssignee())
                .applicationNumber(request.getApplicationNumber())
                .jurisdiction(request.getJurisdiction())
                .ipType(request.getIpType())
                .filingDate(filingDate)
                .priorityDate(priorityDate)
                .publicationDate(publicationDate)
                .grantDate(grantDate)
                .expiryDate(expiry)
                .renewalDate(renewal)
                .currentStatus(currentStatus)
                .source("IP_SEARCH")
                .build();

        f = repository.save(f);
        return toDto(f);
    }

    @Override
    public List<FilingTrackerDto> listForUser(Long userId) {
        return repository.findByUserId(userId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public DashboardDto dashboard(Long userId) {
        List<FilingTracker> list = repository.findByUserId(userId);
        LocalDate now = LocalDate.now();
        long total = list.size();
        long granted = list.stream().filter(f -> f.getGrantDate() != null).count();
        long renewalDue = list.stream().filter(f -> f.getRenewalDate() != null &&
                !f.getRenewalDate().isBefore(now) && ChronoUnit.DAYS.between(now, f.getRenewalDate()) <= 30)
                .count();
        long expired = list.stream().filter(f -> f.getExpiryDate() != null && f.getExpiryDate().isBefore(now)).count();

        DashboardDto d = new DashboardDto();
        d.setTotal(total);
        d.setGranted(granted);
        d.setRenewalDue(renewalDue);
        d.setExpired(expired);
        return d;
    }

    @Override
    public FilingTrackerDto getById(Long id, Long userId) {
        return repository.findById(id)
                .filter(f -> f.getUserId().equals(userId))
                .map(this::toDto)
                .orElse(null);
    }

    private FilingTrackerDto toDto(FilingTracker f) {
        FilingTrackerDto d = new FilingTrackerDto();
        d.setId(f.getId());
        d.setTitle(f.getTitle());
        d.setAbstractText(f.getAbstractText());
        d.setInventors(f.getInventors());
        d.setAssignee(f.getAssignee());
        d.setApplicationNumber(f.getApplicationNumber());
        d.setJurisdiction(f.getJurisdiction());
        d.setIpType(f.getIpType());
        d.setFilingDate(f.getFilingDate());
        d.setPriorityDate(f.getPriorityDate());
        d.setPublicationDate(f.getPublicationDate());
        d.setGrantDate(f.getGrantDate());
        d.setExpiryDate(f.getExpiryDate());
        d.setRenewalDate(f.getRenewalDate());
        d.setCurrentStatus(f.getCurrentStatus());
        d.setSource(f.getSource());
        d.setTrackedAt(f.getTrackedAt());
        d.setUpdatedAt(f.getUpdatedAt());
        return d;
    }
}
