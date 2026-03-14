package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, String> {
    List<UserProgress> findByUserIdAndLessonId(String userId, String lessonId);
    List<UserProgress> findByUserId(String userId);
}
