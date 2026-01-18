package com.example.demo.admin.service;

import com.example.demo.admin.dto.AdminDashboardStatsDTO;
import com.example.demo.entity.User;
import com.example.demo.filing.entity.PatentFiling;
import com.example.demo.filing.repository.PatentFilingRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final PatentFilingRepository patentFilingRepository;

    public AdminDashboardStatsDTO getDashboardStats() {
        AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO();
        
        List<User> allUsers = userRepository.findAll();
        List<PatentFiling> allFilings = patentFilingRepository.findAll();

        // 1. User Stats
        long totalUsers = allUsers.size();
        long activeUsers = allUsers.stream().filter(u -> "Active".equalsIgnoreCase(u.getRole()) || true).count(); // For now assume all are active or check login logic if available
        // Let's just say 'Active' users are those created in last 6 months for mock logic or if there's a status field
        // User entity has 'role' but not 'status'. We'll just count all for now as 'active' for this demo.
        
        long newUsersThisMonth = allUsers.stream()
                .filter(u -> isCurrentMonth(u.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate()))
                .count();

        stats.setUserStats(Map.of(
                "total", totalUsers,
                "active", totalUsers, // simplistic
                "newThisMonth", newUsersThisMonth
        ));

        // 2. Filing Stats
        long totalFilings = allFilings.size();
        long filingsThisMonth = allFilings.stream()
                .filter(f -> isCurrentMonth(f.getFilingDate()))
                .count();

        stats.setFilingStats(Map.of(
                "total", totalFilings,
                "newThisMonth", filingsThisMonth
        ));

        // 3. Revenue Stats (Sum of totalFee for 'paid' filings)
        double totalRevenue = allFilings.stream()
                .filter(f -> "paid".equalsIgnoreCase(f.getPaymentStatus()) && f.getTotalFee() != null)
                .mapToDouble(PatentFiling::getTotalFee)
                .sum();
        
        // Est monthly revenue (simple average or just this month)
        double monthlyRevenue = allFilings.stream()
                .filter(f -> isCurrentMonth(f.getFilingDate()) && "paid".equalsIgnoreCase(f.getPaymentStatus()) && f.getTotalFee() != null)
                .mapToDouble(PatentFiling::getTotalFee)
                .sum();

        stats.setRevenueStats(Map.of(
                "total", totalRevenue,
                "monthly", monthlyRevenue
        ));

        // 4. API Health (Mock static)
        stats.setApiHealth(Map.of(
                "status", "online",
                "value", "99.9%"
        ));

        // 5. User Growth Data (Last 5 months)
        stats.setUserGrowthData(calculateUserGrowth(allUsers));

        // 6. Filing Status Data (Pie chart)
        stats.setFilingStatusData(calculateFilingStatusDistribution(allFilings));

        // 7. Platform Activity (Recent filings + Recent users)
        stats.setPlatformActivity(calculateRecentActivity(allFilings, allUsers));

        return stats;
    }

    private boolean isCurrentMonth(LocalDate date) {
        if (date == null) return false;
        YearMonth current = YearMonth.now();
        return YearMonth.from(date).equals(current);
    }

    private List<Map<String, Object>> calculateUserGrowth(List<User> users) {
        // Group by Month (Last 5 months)
        Map<YearMonth, Long> counts = users.stream()
                .map(u -> YearMonth.from(u.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate()))
                .collect(Collectors.groupingBy(ym -> ym, Collectors.counting()));

        List<Map<String, Object>> growthData = new ArrayList<>();
        YearMonth current = YearMonth.now();
        
        for (int i = 4; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            long count = 0;
            // Cumulative up to this month? Or just new users? Chart usually shows trend.
            // Let's do cumulative for "Growth Trend"
            YearMonth finalMonth = month;
            long cumulative = users.stream()
                    .filter(u -> !YearMonth.from(u.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate()).isAfter(finalMonth))
                    .count();
            
            growthData.add(Map.of(
                    "name", month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    "users", cumulative
            ));
        }
        return growthData;
    }

    private List<Map<String, Object>> calculateFilingStatusDistribution(List<PatentFiling> filings) {
        Map<String, Long> statusCounts = filings.stream()
                .collect(Collectors.groupingBy(f -> f.getStatus() != null ? f.getStatus() : "Unknown", Collectors.counting()));

        List<Map<String, Object>> data = new ArrayList<>();
        String[] colors = {"#8884d8", "#ffc658", "#82ca9d", "#ff8042", "#d8b4fe"};
        int i = 0;
        
        for (Map.Entry<String, Long> entry : statusCounts.entrySet()) {
            data.add(Map.of(
                    "name", entry.getKey(),
                    "value", entry.getValue(),
                    "color", colors[i % colors.length]
            ));
            i++;
        }
        
        // If empty, add dummy
        if (data.isEmpty()) {
             data.add(Map.of("name", "No Data", "value", 1, "color", "#30363d"));
        }
        
        return data;
    }

    private List<Map<String, Object>> calculateRecentActivity(List<PatentFiling> filings, List<User> users) {
        List<Map<String, Object>> activities = new ArrayList<>();

        // Add Recent Filings
        for (PatentFiling f : filings) {
            activities.add(Map.of(
                    "id", "F-" + f.getId(),
                    "action", "New Filing Submitted",
                    "user", f.getApplicantName(),
                    "time", f.getCreatedAt().toString(), // ISO timestamp, frontend can format "ago"
                    "timestamp", f.getCreatedAt().toEpochMilli(),
                    "status", "green"
            ));
        }

        // Add Recent Users
        for (User u : users) {
            activities.add(Map.of(
                    "id", "U-" + u.getId(),
                    "action", "New User Registered",
                    "user", u.getName(),
                    "time", u.getCreatedAt().toString(),
                    "timestamp", u.getCreatedAt().toEpochMilli(),
                    "status", "blue"
            ));
        }

        // Sort by timestamp desc and take top 5
        return activities.stream()
                .sorted((a, b) -> Long.compare((Long) b.get("timestamp"), (Long) a.get("timestamp")))
                .limit(5)
                .collect(Collectors.toList());
    }
}
