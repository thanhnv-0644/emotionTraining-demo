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
    private long totalUsers;
    private long totalCourses;
    private long totalEnrollments;
    private long totalRevenue;
    private List<MonthlyRevenue> revenueByMonth;
    private List<TopCourse> topCourses;
    private Map<String, Double> emotionAccuracy;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenue {
        private String month;
        private long revenue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopCourse {
        private String courseId;
        private String title;
        private long enrollments;
    }
}
