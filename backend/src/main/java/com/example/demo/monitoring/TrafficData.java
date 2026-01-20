package com.example.demo.monitoring;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

@Data
public class TrafficData implements Serializable {
    private List<TrafficDataPoint> trafficData;
    private RealtimeStats realtimeStats;
    private ServerLoad serverLoad;

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

    @Data
    public static class ServerLoad {
        private double cpuUsage; // percentage
        private double memoryUsage; // percentage
        private double diskIo; // percentage
        private double networkIo; // percentage
    }
}