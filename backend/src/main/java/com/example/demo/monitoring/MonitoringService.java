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
    
    public PatentTrendsData getPatentTrends() {
        PatentTrendsData data = new PatentTrendsData();
        
        // 1. Overall Stats
        long total = filingRepository.count();
        long newFilings = filingRepository.countByCreatedAtAfter(java.time.Instant.now().minus(30, java.time.temporal.ChronoUnit.DAYS));
        
        List<Object[]> statusCounts = filingRepository.countByStatus();
        long granted = 0;
        long pending = 0;
        long rejected = 0;
        
        for (Object[] row : statusCounts) {
            String status = (String) row[0];
            Long count = (Long) row[1];
            if (status == null) continue;
            
            if (status.equalsIgnoreCase("GRANTED")) granted += count;
            else if (status.equalsIgnoreCase("REJECTED") || status.equalsIgnoreCase("Withdrawn")) rejected += count;
            else pending += count; // Default internal bucket
        }
        
        PatentTrendsData.PatentStats stats = new PatentTrendsData.PatentStats();
        stats.setTotalPatents(total);
        stats.setNewFilings(newFilings);
        stats.setGrantedPatents(granted);
        stats.setPendingApplications(pending);
        stats.setRejectedApplications(rejected);
        data.setPatentStats(stats);
        
        // 2. Trending Categories
        List<Object[]> fieldCounts = filingRepository.countByTechnicalField();
        List<PatentTrendsData.CategoryTrend> categories = new java.util.ArrayList<>();
        for (Object[] row : fieldCounts) {
            PatentTrendsData.CategoryTrend c = new PatentTrendsData.CategoryTrend();
            c.setCategory((String) row[0]);
            c.setPatents((Long) row[1]);
            // Mock growth for now as we don't have historical snapshots
            c.setGrowth("+" + (int)(Math.random() * 20 + 5) + "%"); 
            categories.add(c);
        }
        //Sort by count desc
        categories.sort((a,b) -> Long.compare(b.getPatents(), a.getPatents()));
        data.setTrendingCategories(categories.size() > 5 ? categories.subList(0, 5) : categories);
        
        // 3. Jurisdictions
        List<Object[]> jurisdictionCounts = filingRepository.countByJurisdiction();
        List<PatentTrendsData.JurisdictionStats> jurisdictions = new java.util.ArrayList<>();
        for (Object[] row : jurisdictionCounts) {
            PatentTrendsData.JurisdictionStats j = new PatentTrendsData.JurisdictionStats();
            j.setCountry((String) row[0]);
            long count = (Long) row[1];
            j.setPatents(count);
            j.setPercentage(total > 0 ? (double)count / total * 100 : 0);
            jurisdictions.add(j);
        }
        jurisdictions.sort((a,b) -> Long.compare(b.getPatents(), a.getPatents()));
        data.setJurisdictions(jurisdictions);
        
        // 4. Filing Status Distribution (Detailed)
        List<PatentTrendsData.StatusDistribution> statusDist = new java.util.ArrayList<>();
        String[] colors = {"bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500"};
        int colorIdx = 0;
        
        for (Object[] row : statusCounts) {
            if (row[0] == null) continue;
            PatentTrendsData.StatusDistribution s = new PatentTrendsData.StatusDistribution();
            s.setStatus((String) row[0]);
            s.setCount((Long) row[1]);
            s.setColor(colors[colorIdx % colors.length]);
            statusDist.add(s);
            colorIdx++;
        }
        data.setFilingStatus(statusDist);
        
        return data;
    }
}
