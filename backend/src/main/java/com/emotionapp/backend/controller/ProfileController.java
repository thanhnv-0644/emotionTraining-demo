package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.ProgressResponse;
import com.emotionapp.backend.dto.response.UserResponse;
import com.emotionapp.backend.service.ProgressService;
import com.emotionapp.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;
    private final ProgressService progressService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(userService.getMe(userId)));
    }

    @GetMapping("/me/progress")
    public ResponseEntity<ApiResponse<List<ProgressResponse>>> getMyProgress() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(progressService.getMyProgress(userId)));
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
