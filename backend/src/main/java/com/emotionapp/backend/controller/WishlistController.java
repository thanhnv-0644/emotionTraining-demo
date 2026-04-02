package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.WishlistResponse;
import com.emotionapp.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistResponse>>> getMyWishlist() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(wishlistService.getMyWishlist(userId)));
    }

    @PostMapping("/{courseId}")
    public ResponseEntity<ApiResponse<WishlistResponse>> addToWishlist(@PathVariable String courseId) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Added to wishlist", wishlistService.addToWishlist(userId, courseId)));
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(@PathVariable String courseId) {
        String userId = getCurrentUserId();
        wishlistService.removeFromWishlist(userId, courseId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", null));
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
