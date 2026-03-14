package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.CourseDetailResponse;
import com.emotionapp.backend.dto.response.CourseResponse;
import com.emotionapp.backend.service.CourseService;
import com.emotionapp.backend.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllPublished() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllPublished()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDetailResponse>> getCourseById(@PathVariable String id) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(courseService.getCourseById(id, userId)));
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<ApiResponse<CourseResponse>> enroll(@PathVariable String id) {
        String userId = getCurrentUserId();
        CourseResponse response = enrollmentService.enrollFree(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Enrolled successfully", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyEnrollments() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getMyEnrollments(userId)));
    }

    private String getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }
}
