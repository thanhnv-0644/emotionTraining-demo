package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.SubmitProgressRequest;
import com.emotionapp.backend.dto.response.ProgressResponse;

import java.util.List;

public interface IProgressService {
    ProgressResponse submitProgress(String lessonId, String userId, SubmitProgressRequest request);
    List<ProgressResponse> getMyProgress(String userId);
    List<ProgressResponse> getProgressByLesson(String lessonId, String userId);
}
