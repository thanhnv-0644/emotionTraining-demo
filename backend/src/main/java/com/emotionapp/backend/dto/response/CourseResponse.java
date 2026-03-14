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
public class CourseResponse {
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
}
