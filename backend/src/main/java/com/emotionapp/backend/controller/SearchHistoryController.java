package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.request.CreateSearchHistoryRequest;
import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.SearchHistoryResponse;
import com.emotionapp.backend.service.SearchHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search-histories")
@RequiredArgsConstructor
public class SearchHistoryController {

    private final SearchHistoryService searchHistoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SearchHistoryResponse>>> getHistory() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(searchHistoryService.getHistory(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<List<SearchHistoryResponse>>> addHistory(
            @Valid @RequestBody CreateSearchHistoryRequest request) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(searchHistoryService.addHistory(userId, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOne(@PathVariable String id) {
        String userId = getCurrentUserId();
        searchHistoryService.deleteOne(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Deleted successfully", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAll() {
        String userId = getCurrentUserId();
        searchHistoryService.deleteAll(userId);
        return ResponseEntity.ok(ApiResponse.success("All search history cleared", null));
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
