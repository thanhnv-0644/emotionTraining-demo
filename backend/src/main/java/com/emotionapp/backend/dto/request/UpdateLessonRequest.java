package com.emotionapp.backend.dto.request;

import lombok.Data;

@Data
public class UpdateLessonRequest {
    private String title;
    private int order;
    private String level;
    private Integer duration;
    private String status;
}
