package com.example.demo.monitoring;

import org.springframework.stereotype.Service;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
@lombok.RequiredArgsConstructor
public class MonitoringService {
    
    // In-memory store for stats (resets on restart)
    private final Map<String, SystemHealthData.EndpointMetric> endpointStats = new ConcurrentHashMap<>();
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong totalErrors = new AtomicLong(0);
    private final AtomicLong totalTimeMs = new AtomicLong(0);
    private final long startTime = System.currentTimeMillis();

    public void recordRequest(String path, long timeTaken, boolean isError) {
        // Global stats
        totalRequests.incrementAndGet();
        totalTimeMs.addAndGet(timeTaken);
        if (isError) totalErrors.incrementAndGet();
        
        // Per endpoint stats (simplify path to avoid high cardinality, e.g. remove IDs)
        String simplifiedPath = simplifyPath(path);
        endpointStats.computeIfAbsent(simplifiedPath, k -> {
            SystemHealthData.EndpointMetric m = new SystemHealthData.EndpointMetric();
            m.setPath(k);
            m.setStatus("healthy");
            return m;
        }).record(timeTaken, isError);
    }
    
    public SystemHealthData getHealthData() {
        SystemHealthData data = new SystemHealthData();
        
        // Uptime
        long uptimeMs = System.currentTimeMillis() - startTime;
        Duration d = Duration.ofMillis(uptimeMs);
        data.setUptime(String.format("%dd %dh %dm", d.toDays(), d.toHoursPart(), d.toMinutesPart()));
        
        // Global Metrics
        long reqs = totalRequests.get();
        if (reqs > 0) {
            data.setResponseTimeMs((double) totalTimeMs.get() / reqs);
            data.setErrorRatePercent(((double) totalErrors.get() / reqs) * 100.0);
        }
        data.setTotalRequests(reqs);
        
        // Approx RPM (total requests / uptime minutes)
        long minutes = d.toMinutes();
        if (minutes < 1) minutes = 1;
        data.setRequestsPerMinute(reqs / minutes);
        
        // Endpoints
        data.setEndpoints(endpointStats);
        
        return data;
    }
    
    private final com.example.demo.repository.UserRepository userRepository;
    private final com.example.demo.filing.repository.PatentFilingRepository filingRepository;
    
    // We maintain a simple in-memory counter for searches/views for demo purposes
    // In a real app, these would be in a dedicated analytics table.
    private final AtomicLong searchQueries = new AtomicLong(0);
    private final AtomicLong patentViews = new AtomicLong(0);

    // Call this from controllers when actions happen
    public void recordSearch() { searchQueries.incrementAndGet(); }
    public void recordPatentView() { patentViews.incrementAndGet(); }

    public ActivityStatsData getActivityStats() {
        ActivityStatsData data = new ActivityStatsData();
        
        // Users
        long totalUsers = userRepository.count();
        data.setTotalUsers(totalUsers);
        
        // Active Users (Mock logic: 70% of total for demo)
        data.setActiveUsers((long)(totalUsers * 0.7)); 

        // New Registrations (e.g. users created in last 7 days)
        // For simplicity, we just count all for this demo or specific logic
        data.setNewRegistrations(userRepository.countByCreatedAtAfter(java.time.Instant.now().minus(7, java.time.temporal.ChronoUnit.DAYS)));
        
        data.setSearchQueries(searchQueries.get());
        data.setPatentViews(patentViews.get());
        
        // Top Activities (Mock generation using real counts)
        List<ActivityStatsData.TopActivity> activities = new java.util.ArrayList<>();
        
        ActivityStatsData.TopActivity filingAct = new ActivityStatsData.TopActivity();
        filingAct.setActivity("Filing Submissions");
        filingAct.setCount(filingRepository.count());
        filingAct.setTrend("+5%");
        activities.add(filingAct);
        
        ActivityStatsData.TopActivity searchAct = new ActivityStatsData.TopActivity();
        searchAct.setActivity("Patent Search");
        searchAct.setCount(searchQueries.get());
        searchAct.setTrend("+12%");
        activities.add(searchAct);
        
        data.setTopActivities(activities);
        
        return data;
    }

    private String simplifyPath(String path) {
        // Replace numbers with {id} to group similar endpoints
        return path.replaceAll("/\\d+", "/{id}");
    }
}
