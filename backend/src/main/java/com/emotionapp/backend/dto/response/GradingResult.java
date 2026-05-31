package com.emotionapp.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GradingResult {
    private int score;
    private String answersJson;
}
