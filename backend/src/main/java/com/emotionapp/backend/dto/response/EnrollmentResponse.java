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
public class EnrollmentResponse {
    private String id;
    private String userId;
    private String userName;
    private String courseId;
    private String courseTitle;
    private String paymentId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
