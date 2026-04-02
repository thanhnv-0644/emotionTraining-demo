package com.emotionapp.backend.repository;

import com.emotionapp.backend.entity.AudioClip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AudioClipRepository extends JpaRepository<AudioClip, String> {
    List<AudioClip> findByLessonIdAndDeletedAtIsNullOrderByOrder(String lessonId);
    List<AudioClip> findByLessonIdOrderByOrder(String lessonId);
    List<AudioClip> findByLessonId(String lessonId);
    int countByLessonIdAndDeletedAtIsNull(String lessonId);
}
