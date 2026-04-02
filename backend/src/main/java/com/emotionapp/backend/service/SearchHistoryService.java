package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.CreateSearchHistoryRequest;
import com.emotionapp.backend.dto.response.SearchHistoryResponse;
import com.emotionapp.backend.entity.SearchHistory;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.SearchHistoryRepository;
import com.emotionapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchHistoryService {

    private final SearchHistoryRepository searchHistoryRepository;
    private final UserRepository userRepository;

    public List<SearchHistoryResponse> getHistory(String userId) {
        return searchHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SearchHistoryResponse> addHistory(String userId, CreateSearchHistoryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        LocalDateTime now = LocalDateTime.now();
        List<SearchHistory> histories = request.getKeywords().stream()
                .filter(k -> k != null && !k.isBlank())
                .map(keyword -> SearchHistory.builder()
                        .id(IdGenerator.generateId())
                        .user(user)
                        .keyword(keyword.trim())
                        .createdAt(now)
                        .build())
                .collect(Collectors.toList());

        searchHistoryRepository.saveAll(histories);
        return histories.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteOne(String userId, String id) {
        searchHistoryRepository.deleteByUserIdAndId(userId, id);
    }

    @Transactional
    public void deleteAll(String userId) {
        searchHistoryRepository.deleteByUserId(userId);
    }

    private SearchHistoryResponse toResponse(SearchHistory history) {
        return SearchHistoryResponse.builder()
                .id(history.getId())
                .userId(history.getUser().getId())
                .keyword(history.getKeyword())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
