package com.emotionapp.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateSearchHistoryRequest {

    @NotEmpty(message = "Keywords must not be empty")
    private List<@Size(max = 500, message = "Keyword must not exceed 500 characters") String> keywords;
}
