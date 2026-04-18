package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.response.LeaderboardEntryResponse;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.repository.UserProgressRepository;
import com.emotionapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;

    public int getUserRank(String userId) {
        // Count how many active students have strictly higher XP
        Optional<User> target = userRepository.findByDeletedAtIsNull().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst();
        if (target.isEmpty()) return -1;
        int userXp = target.get().getXp() != null ? target.get().getXp() : 0;

        long higherCount = userRepository.findByDeletedAtIsNull().stream()
                .filter(u -> u.getStatus() == User.Status.active
                          && u.getRole() == User.Role.student
                          && (u.getXp() != null ? u.getXp() : 0) > userXp)
                .count();
        return (int) higherCount + 1;
    }

    public List<LeaderboardEntryResponse> getLeaderboard(int limit) {
        // Aggregate progress stats per user in one query
        List<Object[]> stats = userProgressRepository.findProgressStatsByUser();

        Map<String, Long> countMap = new HashMap<>();
        Map<String, Double> avgMap = new HashMap<>();
        for (Object[] row : stats) {
            String userId = (String) row[0];
            countMap.put(userId, ((Number) row[1]).longValue());
            avgMap.put(userId, row[2] != null ? ((Number) row[2]).doubleValue() : 0.0);
        }

        // Get all active students
        List<User> users = userRepository.findByDeletedAtIsNull().stream()
                .filter(u -> u.getStatus() == User.Status.active
                          && u.getRole() == User.Role.student)
                .sorted(Comparator
                        .comparingInt((User u) -> -(u.getXp() != null ? u.getXp() : 0))
                        .thenComparingDouble(u -> -avgMap.getOrDefault(u.getId(), 0.0)))
                .limit(limit)
                .collect(Collectors.toList());

        // Map to response with rank
        List<LeaderboardEntryResponse> result = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            String uid = u.getId();
            result.add(LeaderboardEntryResponse.builder()
                    .rank(i + 1)
                    .userId(uid)
                    .name(u.getName())
                    .avatar(u.getAvatar())
                    .xp(u.getXp() != null ? u.getXp() : 0)
                    .totalLessonsCompleted(countMap.getOrDefault(uid, 0L).intValue())
                    .avgScore(Math.round(avgMap.getOrDefault(uid, 0.0) * 10.0) / 10.0)
                    .build());
        }
        return result;
    }
}
