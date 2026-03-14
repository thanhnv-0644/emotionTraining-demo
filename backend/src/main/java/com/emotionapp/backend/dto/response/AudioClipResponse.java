package com.emotionapp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AudioClipResponse {
    private String id;
    private String lessonId;
    private String subject;
    private String audioUrl;
    private Integer duration;
    private String targetEmotion;
    private Integer order;
}
