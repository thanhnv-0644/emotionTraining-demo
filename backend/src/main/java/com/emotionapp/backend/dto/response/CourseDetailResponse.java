package com.emotionapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailResponse {
    private String id;
    private String title;
    private String description;
    private String image;
    private Integer price;
    private boolean isFree;
    private String status;
    private String category;
    private LocalDateTime createdAt;
    private boolean enrolled;
    private int lessonCount;
    private List<LessonResponse> lessons;
}
