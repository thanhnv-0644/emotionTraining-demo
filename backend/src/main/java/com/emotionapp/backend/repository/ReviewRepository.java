package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByCourseId(String courseId);
    List<Review> findByCourseIdAndDeletedAtIsNullOrderByCreatedAtDesc(String courseId);
    Optional<Review> findByUserIdAndCourseId(String userId, String courseId);
    Optional<Review> findByUserIdAndCourseIdAndDeletedAtIsNull(String userId, String courseId);
}
