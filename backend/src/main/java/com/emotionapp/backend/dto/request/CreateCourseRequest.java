package com.emotionapp.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCourseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String image;

    private int price;

    @NotBlank(message = "Category is required")
    private String category;
}
