package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByStatusAndDeletedAtIsNull(Course.Status status);
    List<Course> findByStatusAndCategoryAndDeletedAtIsNull(Course.Status status, Course.Category category);
    List<Course> findByDeletedAtIsNull();
}
