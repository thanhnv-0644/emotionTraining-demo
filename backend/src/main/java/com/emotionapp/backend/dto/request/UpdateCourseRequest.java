package com.emotionapp.backend.dto.request;

import lombok.Data;

@Data
public class UpdateCourseRequest {
    private String title;
    private String description;
    private String image;
    private int price;
    private String status;
    private String category;
}
