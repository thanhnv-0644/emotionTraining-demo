package com.emotionapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {
    // ── Tổng quan ────────────────────────────────────────
    private long totalUsers;
    private long totalCourses;
    private long totalEnrollments;
    private long totalRevenue;
    private long totalLessons;
    private double avgSystemScore;

    // ── 30 ngày gần nhất ─────────────────────────────────
    private long newUsersLast30Days;
    private long activeUsersLast30Days;   // distinct users có progress trong 30 ngày

    // ── Phân phối ────────────────────────────────────────
    private Map<String, Long> roleDistribution;   // student/instructor/admin -> count

    // ── Xu hướng (12 tháng) ──────────────────────────────
    private List<MonthlyRevenue> revenueByMonth;
    private List<MonthlyCount>   userGrowth;

    // ── Cảm xúc & khoá học ───────────────────────────────
    private Map<String, Double> emotionAccuracy;
    private List<TopCourse>     topCourses;

    // ── Inner classes ─────────────────────────────────────

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MonthlyRevenue {
        private String month;
        private long revenue;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MonthlyCount {
        private String month;
        private long count;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TopCourse {
        private String courseId;
        private String title;
        private long enrollments;
        private long revenue;
        private double avgScore;
    }
}
