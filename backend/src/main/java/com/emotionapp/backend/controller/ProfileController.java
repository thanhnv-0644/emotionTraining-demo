package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.request.ChangePasswordRequest;
import com.emotionapp.backend.dto.request.UpdateProfileRequest;
import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.ProgressResponse;
import com.emotionapp.backend.dto.response.UserAnalyticsResponse;
import com.emotionapp.backend.dto.response.UserResponse;
import com.emotionapp.backend.service.AnalyticsService;
import com.emotionapp.backend.service.FileStorageService;
import com.emotionapp.backend.service.ProgressService;
import com.emotionapp.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;
    private final ProgressService progressService;
    private final AnalyticsService analyticsService;
    private final FileStorageService fileStorageService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(userService.getMe(userId)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateProfile(userId, request)));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(getCurrentUserId(), request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(@RequestParam("file") MultipartFile file) throws IOException {
        String avatarUrl = fileStorageService.saveAvatar(file);
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setAvatar(avatarUrl);
        return ResponseEntity.ok(ApiResponse.success("Avatar updated", userService.updateProfile(getCurrentUserId(), req)));
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
