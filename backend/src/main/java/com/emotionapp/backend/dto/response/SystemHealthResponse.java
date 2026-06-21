package com.emotionapp.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SystemHealthResponse {
    private boolean aiServiceOnline;
    private String aiServiceUrl;
    private String aiModelName;
    private long uptimeSeconds;
    private long totalUsers;
    private long totalCourses;
    private long totalLessons;
    private long totalProgress;
    private long totalPayments;
}
