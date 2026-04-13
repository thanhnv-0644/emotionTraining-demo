package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.LeaderboardEntryResponse;
import com.emotionapp.backend.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaderboardEntryResponse>>> getLeaderboard(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.success(leaderboardService.getLeaderboard(Math.min(limit, 50))));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Integer>> getMyRank() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<LeaderboardEntryResponse> all = leaderboardService.getLeaderboard(50);
        int rank = all.stream()
                .filter(e -> e.getUserId().equals(userId))
                .map(LeaderboardEntryResponse::getRank)
                .findFirst()
                .orElse(-1);
        return ResponseEntity.ok(ApiResponse.success(rank));
    }
}
