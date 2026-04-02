package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {
    List<Enrollment> findByUserId(String userId);
    List<Enrollment> findByCourseId(String courseId);
    Optional<Enrollment> findByUserIdAndCourseId(String userId, String courseId);
    boolean existsByUserIdAndCourseId(String userId, String courseId);
}
