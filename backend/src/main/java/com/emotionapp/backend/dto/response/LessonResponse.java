package com.emotionapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponse {
    private String id;
    private String courseId;
    private String title;
    private Integer order;
    private String level;
    private Integer duration;
    private String status;
    private int audioClipCount;
}
