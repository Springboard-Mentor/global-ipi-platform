package com.example.demo.monitoring;

import lombok.Data;
import java.io.Serializable;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Data
public class SystemHealthData implements Serializable {
    private String uptime;
    private double responseTimeMs; // average
    private long totalRequests;
    private long requestsPerMinute;
    private double errorRatePercent;
    private Map<String, EndpointMetric> endpoints = new ConcurrentHashMap<>();
    private Map<String, TrafficDataPoint> trafficData = new ConcurrentHashMap<>();
    private RealtimeStats realtimeStats = new RealtimeStats();

    @Data
    public static class EndpointMetric {
        private String path;
        private String status; // healthy, warning, error
        private double averageResponseTime;
        private long requestCount;
        private long errorCount;

        // Transient/Internal use
        private transient AtomicLong totalTime = new AtomicLong(0);
        private transient AtomicLong totalReqs = new AtomicLong(0);
        private transient AtomicLong totalErrs = new AtomicLong(0);

        public void record(long timeMs, boolean isError) {
            totalReqs.incrementAndGet();
            totalTime.addAndGet(timeMs);
            if (isError) totalErrs.incrementAndGet();

            this.requestCount = totalReqs.get();
            this.errorCount = totalErrs.get();
            this.averageResponseTime = (double) totalTime.get() / totalReqs.get();

            // logic for status
            if (this.averageResponseTime > 500 || (totalReqs.get() > 0 && ((double)totalErrs.get()/totalReqs.get() > 0.05))) {
                this.status = "warning";
            } else if (this.averageResponseTime > 2000) {
                 this.status = "error";
            } else {
                this.status = "healthy";
            }
        }
    }

    @Data
    public static class TrafficDataPoint {
        private String time;
        private long requests;
        private long users;
        private long errors;
    }

    @Data
    public static class RealtimeStats {
        private long currentUsers;
        private long requestsPerSecond;
        private long activeConnections;
        private long bandwidth; // MB/s
    }
}
