package com.emotionapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAnalyticsResponse {
    private long totalLessonsCompleted;
    private double avgScore;
    private int totalXp;
    private Map<String, EmotionStat> emotionAccuracy;
    private String weakestEmotion;
    private String strongestEmotion;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmotionStat {
        private int correct;
        private int total;
        private double accuracy;
    }
}
