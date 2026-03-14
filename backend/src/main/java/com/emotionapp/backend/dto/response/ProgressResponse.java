package com.emotionapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {
    private String id;
    private String userId;
    private String lessonId;
    private Integer attemptNumber;
    private Integer score;
    private LocalDateTime completedAt;
    private String answers;
    private LocalDateTime createdAt;
}
