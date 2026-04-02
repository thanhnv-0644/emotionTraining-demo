package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.request.UpdateProfileRequest;
import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.ProgressResponse;
import com.emotionapp.backend.dto.response.UserAnalyticsResponse;
import com.emotionapp.backend.dto.response.UserResponse;
import com.emotionapp.backend.service.AnalyticsService;
import com.emotionapp.backend.service.ProgressService;
import com.emotionapp.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;
    private final ProgressService progressService;
    private final AnalyticsService analyticsService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(userService.getMe(userId)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody UpdateProfileRequest request) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateProfile(userId, request)));
    }

    @GetMapping("/me/progress")
    public ResponseEntity<ApiResponse<List<ProgressResponse>>> getMyProgress() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(progressService.getMyProgress(userId)));
    }

    @GetMapping("/me/analytics")
    public ResponseEntity<ApiResponse<UserAnalyticsResponse>> getMyAnalytics() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getUserAnalytics(userId)));
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
