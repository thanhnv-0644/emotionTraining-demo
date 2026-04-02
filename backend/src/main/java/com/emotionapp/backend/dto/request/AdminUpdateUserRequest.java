package com.emotionapp.backend.dto.request;

import lombok.Data;

@Data
public class AdminUpdateUserRequest {
    private String name;
    private String role;
    private String status;
    private Integer xp;
}
