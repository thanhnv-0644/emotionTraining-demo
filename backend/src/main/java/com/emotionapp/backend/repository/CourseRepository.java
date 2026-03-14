package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByStatus(Course.Status status);
    List<Course> findByStatusAndCategory(Course.Status status, Course.Category category);
}
