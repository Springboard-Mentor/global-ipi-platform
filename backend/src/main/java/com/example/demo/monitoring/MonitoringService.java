package com.example.demo.monitoring;

import org.springframework.stereotype.Service;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@Service
@lombok.RequiredArgsConstructor
public class MonitoringService {

    // In-memory store for stats (resets on restart)
    private final Map<String, SystemHealthData.EndpointMetric> endpointStats = new ConcurrentHashMap<>();
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong totalErrors = new AtomicLong(0);
    private final AtomicLong totalTimeMs = new AtomicLong(0);
    private final long startTime = System.currentTimeMillis();

    // Traffic data storage for charts
    private final List<SystemHealthData.TrafficDataPoint> trafficHistory = new ArrayList<>();
    private final AtomicLong currentUsers = new AtomicLong(0);
    private final AtomicLong activeConnections = new AtomicLong(0);

    public void recordRequest(String path, long timeTaken, boolean isError) {
        // Global stats
        totalRequests.incrementAndGet();
        totalTimeMs.addAndGet(timeTaken);
        if (isError) totalErrors.incrementAndGet();

        // Update real-time counters
        currentUsers.incrementAndGet();
        activeConnections.incrementAndGet();

        // Record traffic data point every minute
        recordTrafficDataPoint(isError);

        // Per endpoint stats (simplify path to avoid high cardinality, e.g. remove IDs)
        String simplifiedPath = simplifyPath(path);
        endpointStats.computeIfAbsent(simplifiedPath, k -> {
            SystemHealthData.EndpointMetric m = new SystemHealthData.EndpointMetric();
            m.setPath(k);
            m.setStatus("healthy");
            return m;
        }).record(timeTaken, isError);
    }

    private void recordTrafficDataPoint(boolean isError) {
        // Only record every 10 seconds to avoid too much data
        if (trafficHistory.size() == 0 || System.currentTimeMillis() - getLastTrafficTimestamp() > 10000) {
            SystemHealthData.TrafficDataPoint point = new SystemHealthData.TrafficDataPoint();
            point.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
            point.setRequests(totalRequests.get());
            point.setUsers(currentUsers.get());
            point.setErrors(isError ? totalErrors.get() : 0);

            synchronized (trafficHistory) {
                trafficHistory.add(point);
                // Keep only last 60 points (10 minutes of data)
                if (trafficHistory.size() > 60) {
                    trafficHistory.remove(0);
                }
            }
        }
    }

    private long getLastTrafficTimestamp() {
        // Simplified - in real implementation, store timestamp with each point
        return System.currentTimeMillis() - 10000;
    }

    public TrafficData getTrafficData() {
        TrafficData data = new TrafficData();

        // Generate traffic data for charts (last 60 points)
        synchronized (trafficHistory) {
            List<TrafficData.TrafficDataPoint> trafficPoints = new ArrayList<>();
            for (SystemHealthData.TrafficDataPoint point : trafficHistory) {
                TrafficData.TrafficDataPoint tp = new TrafficData.TrafficDataPoint();
                tp.setTime(point.getTime());
                tp.setRequests(point.getRequests());
                tp.setUsers(point.getUsers());
                tp.setErrors(point.getErrors());
                trafficPoints.add(tp);
            }
            data.setTrafficData(trafficPoints);
        }

        // Real-time stats
        TrafficData.RealtimeStats stats = new TrafficData.RealtimeStats();
        stats.setCurrentUsers(currentUsers.get());
        stats.setRequestsPerSecond(calculateRequestsPerSecond());
        stats.setActiveConnections(activeConnections.get());
        stats.setBandwidth(calculateBandwidth());
        data.setRealtimeStats(stats);

        // Server load
        TrafficData.ServerLoad load = new TrafficData.ServerLoad();
        load.setCpuUsage(getCpuUsage());
        load.setMemoryUsage(getMemoryUsage());
        load.setDiskIo(getDiskIo());
        load.setNetworkIo(getNetworkIo());
        data.setServerLoad(load);

        return data;
    }

    private long calculateRequestsPerSecond() {
        // Simple calculation based on recent activity
        long uptimeMinutes = (System.currentTimeMillis() - startTime) / 60000;
        if (uptimeMinutes < 1) uptimeMinutes = 1;
        return totalRequests.get() / uptimeMinutes / 60;
    }

    private long calculateBandwidth() {
        // Mock bandwidth calculation (MB/s)
        return (long) (Math.random() * 50 + 20);
    }

    private double getCpuUsage() {
        // Mock CPU usage
        return Math.random() * 30 + 40; // 40-70%
    }

    private double getMemoryUsage() {
        // Mock memory usage
        return Math.random() * 20 + 60; // 60-80%
    }

    private double getDiskIo() {
        // Mock disk I/O
        return Math.random() * 30 + 20; // 20-50%
    }

    private double getNetworkIo() {
        // Mock network I/O
        return Math.random() * 40 + 50; // 50-90%
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

    // Chart data generation methods for frontend
    public List<Map<String, Object>> getTrafficChartData() {
        List<Map<String, Object>> data = new ArrayList<>();
        synchronized (trafficHistory) {
            for (SystemHealthData.TrafficDataPoint point : trafficHistory) {
                Map<String, Object> item = new java.util.HashMap<>();
                item.put("time", point.getTime());
                item.put("requests", point.getRequests());
                item.put("users", point.getUsers());
                item.put("errors", point.getErrors());
                data.add(item);
            }
        }
        return data;
    }

    public List<Map<String, Object>> getResponsePerformanceData() {
        List<Map<String, Object>> data = new ArrayList<>();
        for (SystemHealthData.EndpointMetric metric : endpointStats.values()) {
            Map<String, Object> item = new java.util.HashMap<>();
            item.put("endpoint", metric.getPath());
            item.put("avgResponse", metric.getAverageResponseTime());
            item.put("requests", metric.getRequestCount());
            data.add(item);
        }
        return data;
    }

    public List<Map<String, Object>> getUserActivityData() {
        List<Map<String, Object>> data = new ArrayList<>();
        // Generate last 7 days of mock data
        for (int i = 6; i >= 0; i--) {
            Map<String, Object> item = new java.util.HashMap<>();
            java.time.LocalDate date = java.time.LocalDate.now().minusDays(i);
            item.put("date", date.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd")));
            item.put("users", (long) (Math.random() * 500 + 200));
            item.put("sessions", (long) (Math.random() * 800 + 300));
            data.add(item);
        }
        return data;
    }

    public List<Map<String, Object>> getFeatureUsageData() {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(java.util.Map.of("name", "Search", "value", 35, "color", "#3B82F6"));
        data.add(java.util.Map.of("name", "Patent View", "value", 25, "color", "#10B981"));
        data.add(java.util.Map.of("name", "Filing", "value", 20, "color", "#F59E0B"));
        data.add(java.util.Map.of("name", "Analytics", "value", 12, "color", "#EF4444"));
        data.add(java.util.Map.of("name", "Reports", "value", 8, "color", "#8B5CF6"));
        return data;
    }

    public List<Map<String, Object>> getSessionDurationData() {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(java.util.Map.of("duration", "0-5min", "users", 120));
        data.add(java.util.Map.of("duration", "5-15min", "users", 280));
        data.add(java.util.Map.of("duration", "15-30min", "users", 190));
        data.add(java.util.Map.of("duration", "30-60min", "users", 150));
        data.add(java.util.Map.of("duration", "60min+", "users", 80));
        return data;
    }

    public List<Map<String, Object>> getFilingTrendsData() {
        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            Map<String, Object> item = new java.util.HashMap<>();
            java.time.LocalDate date = java.time.LocalDate.now().minusMonths(i);
            item.put("month", date.format(java.time.format.DateTimeFormatter.ofPattern("MMM yyyy")));
            item.put("filings", (long) (Math.random() * 200 + 100));
            item.put("grants", (long) (Math.random() * 150 + 50));
            data.add(item);
        }
        return data;
    }

    public List<Map<String, Object>> getCategoryData() {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(java.util.Map.of("name", "AI & ML", "value", 25, "color", "#3B82F6"));
        data.add(java.util.Map.of("name", "Biotech", "value", 20, "color", "#10B981"));
        data.add(java.util.Map.of("name", "Renewable Energy", "value", 18, "color", "#F59E0B"));
        data.add(java.util.Map.of("name", "Software", "value", 15, "color", "#EF4444"));
        data.add(java.util.Map.of("name", "Hardware", "value", 12, "color", "#8B5CF6"));
        data.add(java.util.Map.of("name", "Other", "value", 10, "color", "#6B7280"));
        return data;
    }

    public List<Map<String, Object>> getGrantRateData() {
        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            Map<String, Object> item = new java.util.HashMap<>();
            java.time.LocalDate date = java.time.LocalDate.now().minusMonths(i);
            item.put("month", date.format(java.time.format.DateTimeFormatter.ofPattern("MMM")));
            item.put("rate", Math.floor(Math.random() * 20) + 60); // 60-80%
            data.add(item);
        }
        return data;
    }
}
