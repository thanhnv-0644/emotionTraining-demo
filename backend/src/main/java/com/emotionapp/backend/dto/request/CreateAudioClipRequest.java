package com.emotionapp.backend.dto.request;

import lombok.Data;

@Data
public class CreateAudioClipRequest {
    private String subject;
    private String audioUrl;
    private Integer duration;
    private String targetEmotion;
    private int order;
}
