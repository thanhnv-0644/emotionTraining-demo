package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.request.SubmitProgressRequest;
import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.LessonDetailResponse;
import com.emotionapp.backend.dto.response.ProgressResponse;
import com.emotionapp.backend.service.LessonService;
import com.emotionapp.backend.service.ProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;
    private final ProgressService progressService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonDetailResponse>> getLessonDetail(@PathVariable String id) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLessonDetail(id, userId)));
    }

    @PostMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<ProgressResponse>> submitProgress(
            @PathVariable String id,
            @Valid @RequestBody SubmitProgressRequest request) {
        String userId = getCurrentUserId();
        ProgressResponse response = progressService.submitProgress(id, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Progress submitted", response));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<List<ProgressResponse>>> getProgressForLesson(@PathVariable String id) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(progressService.getProgressByLesson(id, userId)));
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
