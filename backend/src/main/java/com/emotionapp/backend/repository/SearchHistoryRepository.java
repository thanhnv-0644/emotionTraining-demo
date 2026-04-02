package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, String> {

    List<SearchHistory> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(String userId);
    
    List<SearchHistory> findByUserIdOrderByCreatedAtDesc(String userId);
    
    void deleteByUserIdAndId(String userId, String id);
    
    void deleteByUserId(String userId);

    java.util.Optional<SearchHistory> findByIdAndUserId(String id, String userId);
}
