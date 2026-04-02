package com.emotionapp.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateSearchHistoryRequest {

    @NotEmpty(message = "Keywords must not be empty")
    private List<String> keywords;
}
