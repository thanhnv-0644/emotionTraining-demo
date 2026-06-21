package com.emotionapp.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SubmitProgressRequest {

    @NotNull(message = "Answers are required")
    private List<AnswerItem> answers;

    @Data
    public static class AnswerItem {
        @NotNull(message = "audioClipId is required")
        private String audioClipId;

        @NotNull(message = "selectedEmotion is required")
        private String selectedEmotion;
    }
}
