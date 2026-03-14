package com.emotionapp.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateLessonRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private int order;

    private String level;

    private Integer duration;
}
