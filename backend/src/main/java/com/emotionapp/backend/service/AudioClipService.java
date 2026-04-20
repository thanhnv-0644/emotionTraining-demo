package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.CreateAudioClipRequest;
import com.emotionapp.backend.dto.request.UpdateAudioClipRequest;
import com.emotionapp.backend.dto.response.AudioClipResponse;
import com.emotionapp.backend.entity.AudioClip;
import com.emotionapp.backend.entity.Lesson;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.AudioClipRepository;
import com.emotionapp.backend.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AudioClipService {

    private final AudioClipRepository audioClipRepository;
    private final LessonRepository lessonRepository;

    public List<AudioClipResponse> getClipsByLesson(String lessonId) {
        return audioClipRepository.findByLessonIdAndDeletedAtIsNullOrderByOrder(lessonId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AudioClipResponse createClip(String lessonId, CreateAudioClipRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Lesson not found"));

        AudioClip.Emotion emotion = null;
        if (request.getTargetEmotion() != null) {
            try {
                emotion = AudioClip.Emotion.valueOf(request.getTargetEmotion());
            } catch (IllegalArgumentException e) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Invalid emotion: " + request.getTargetEmotion());
            }
        }

        int nextOrder = audioClipRepository.countByLessonIdAndDeletedAtIsNull(lessonId) + 1;
        LocalDateTime now = LocalDateTime.now();

        AudioClip clip = AudioClip.builder()
                .id(IdGenerator.generateId())
                .lesson(lesson)
                .subject(request.getSubject())
                .audioUrl(request.getAudioUrl())
                .duration(request.getDuration())
                .targetEmotion(emotion)
                .order(nextOrder)
                .createdAt(now)
                .updatedAt(now)
                .build();

        audioClipRepository.save(clip);
        recalcLessonDuration(lesson);
        return toResponse(clip);
    }

    @Transactional
    public AudioClipResponse updateClip(String clipId, UpdateAudioClipRequest request) {
        AudioClip clip = audioClipRepository.findById(clipId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Audio clip not found"));

        if (request.getSubject() != null) clip.setSubject(request.getSubject());
        if (request.getAudioUrl() != null) clip.setAudioUrl(request.getAudioUrl());
        if (request.getDuration() != null) clip.setDuration(request.getDuration());
        clip.setOrder(request.getOrder());
        clip.setUpdatedAt(LocalDateTime.now());

        if (request.getTargetEmotion() != null) {
            try {
                clip.setTargetEmotion(AudioClip.Emotion.valueOf(request.getTargetEmotion()));
            } catch (IllegalArgumentException e) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Invalid emotion: " + request.getTargetEmotion());
            }
        }

        audioClipRepository.save(clip);
        recalcLessonDuration(clip.getLesson());
        return toResponse(clip);
    }

    @Transactional
    public void deleteClip(String clipId) {
        AudioClip clip = audioClipRepository.findById(clipId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Audio clip not found"));
        clip.setDeletedAt(LocalDateTime.now());
        clip.setUpdatedAt(LocalDateTime.now());
        audioClipRepository.save(clip);
        recalcLessonDuration(clip.getLesson());
    }

    private void recalcLessonDuration(Lesson lesson) {
        int total = audioClipRepository.findByLessonIdAndDeletedAtIsNullOrderByOrder(lesson.getId())
                .stream()
                .mapToInt(c -> c.getDuration() != null ? c.getDuration() : 0)
                .sum();
        lesson.setDuration(total);
        lesson.setUpdatedAt(LocalDateTime.now());
        lessonRepository.save(lesson);
    }

    private AudioClipResponse toResponse(AudioClip clip) {
        return AudioClipResponse.builder()
                .id(clip.getId())
                .lessonId(clip.getLesson().getId())
                .subject(clip.getSubject())
                .audioUrl(clip.getAudioUrl())
                .duration(clip.getDuration())
                .targetEmotion(clip.getTargetEmotion() != null ? clip.getTargetEmotion().name() : null)
                .order(clip.getOrder())
                .build();
    }
}
