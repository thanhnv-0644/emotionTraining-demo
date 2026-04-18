package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, String> {
    List<UserProgress> findByUserIdAndLessonId(String userId, String lessonId);
    List<UserProgress> findByUserId(String userId);
    List<UserProgress> findByCompletedAtBetween(LocalDateTime from, LocalDateTime to);
    List<UserProgress> findByCompletedAtIsNotNull();

    @Query("SELECT p FROM UserProgress p WHERE p.completedAt IS NOT NULL AND p.user.id = :userId")
    List<UserProgress> findCompletedByUserId(String userId);

    @Query("SELECT p.user.id, COUNT(p.id), AVG(p.score) FROM UserProgress p WHERE p.completedAt IS NOT NULL GROUP BY p.user.id")
    List<Object[]> findProgressStatsByUser();

    List<UserProgress> findByCompletedAtAfter(LocalDateTime after);
}
