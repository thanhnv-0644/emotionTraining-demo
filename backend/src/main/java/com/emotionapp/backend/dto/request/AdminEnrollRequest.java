package com.emotionapp.backend.dto.request;

import lombok.Data;

@Data
public class AdminEnrollRequest {
    private String userId;
    private String courseId;
}
