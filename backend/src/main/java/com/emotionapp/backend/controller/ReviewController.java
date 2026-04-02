package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.request.CreateReviewRequest;
import com.emotionapp.backend.dto.request.UpdateReviewRequest;
import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.ReviewResponse;
import com.emotionapp.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses/{id}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviews(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsByCourse(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @PathVariable String id,
            @Valid @RequestBody CreateReviewRequest request) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Review created", reviewService.createReview(id, userId, request)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable String id,
            @RequestBody UpdateReviewRequest request) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Review updated", reviewService.updateReview(id, userId, request)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable String id) {
        String userId = getCurrentUserId();
        reviewService.deleteReview(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}


