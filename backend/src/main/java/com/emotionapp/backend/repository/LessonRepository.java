package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, String> {
    List<Lesson> findByCourseIdOrderByOrder(String courseId);
}
