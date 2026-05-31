package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.CreateLessonRequest;
import com.emotionapp.backend.dto.request.SubmitProgressRequest;
import com.emotionapp.backend.dto.request.UpdateLessonRequest;
import com.emotionapp.backend.dto.response.AudioClipResponse;
import com.emotionapp.backend.dto.response.GradingResult;
import com.emotionapp.backend.dto.response.LessonDetailResponse;
import com.emotionapp.backend.dto.response.LessonResponse;
import com.emotionapp.backend.entity.AudioClip;
import com.emotionapp.backend.entity.Course;
import com.emotionapp.backend.entity.Lesson;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.AudioClipRepository;
import com.emotionapp.backend.repository.CourseRepository;
import com.emotionapp.backend.repository.EnrollmentRepository;
import com.emotionapp.backend.repository.LessonRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonService implements ILessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final AudioClipRepository audioClipRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<LessonResponse> getLessonsByCourse(String courseId) {
        return lessonRepository.findByCourseIdAndDeletedAtIsNullOrderByOrder(courseId)
                .stream()
                .map(this::toLessonResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LessonDetailResponse getLessonDetail(String lessonId, String userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Lesson not found"));

        String courseId = lesson.getCourse().getId();
        boolean enrolled = enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
        if (!enrolled) {
            throw new AppException(HttpStatus.FORBIDDEN, "You are not enrolled in this course");
        }

        List<AudioClip> clips = audioClipRepository.findByLessonIdOrderByOrder(lessonId);
        List<AudioClipResponse> clipResponses = clips.stream()
                .map(this::toAudioClipResponse)
                .collect(Collectors.toList());

        return LessonDetailResponse.builder()
                .id(lesson.getId())
                .courseId(courseId)
                .title(lesson.getTitle())
                .order(lesson.getOrder())
                .level(lesson.getLevel() != null ? lesson.getLevel().name() : null)
                .duration(lesson.getDuration())
                .status(lesson.getStatus().name())
                .audioClipCount(clips.size())
                .audioClips(clipResponses)
                .build();
    }

    @Override
    @Transactional
    public LessonResponse createLesson(String courseId, CreateLessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Course not found"));

        Lesson.Level level = null;
        if (request.getLevel() != null) {
            try {
                level = Lesson.Level.valueOf(request.getLevel());
            } catch (IllegalArgumentException e) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Invalid level: " + request.getLevel());
            }
        }

        int nextOrder = lessonRepository.countByCourseIdAndDeletedAtIsNull(courseId) + 1;

        Lesson lesson = Lesson.builder()
                .id(IdGenerator.generateId())
                .course(course)
                .title(request.getTitle())
                .order(nextOrder)
                .level(level)
                .duration(request.getDuration())
                .status(Lesson.Status.draft)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        lessonRepository.save(lesson);
        return toLessonResponse(lesson);
    }

    @Override
    @Transactional
    public LessonResponse updateLesson(String lessonId, UpdateLessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Lesson not found"));

        if (request.getTitle() != null) lesson.setTitle(request.getTitle());
        lesson.setOrder(request.getOrder());
        lesson.setDuration(request.getDuration());

        if (request.getLevel() != null) {
            try {
                lesson.setLevel(Lesson.Level.valueOf(request.getLevel()));
            } catch (IllegalArgumentException e) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Invalid level: " + request.getLevel());
            }
        }
        if (request.getStatus() != null) {
            try {
                lesson.setStatus(Lesson.Status.valueOf(request.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Invalid status: " + request.getStatus());
            }
        }
        lesson.setUpdatedAt(LocalDateTime.now());

        lessonRepository.save(lesson);
        return toLessonResponse(lesson);
    }

    @Override
    @Transactional
    public void deleteLesson(String lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Lesson not found"));

        LocalDateTime now = LocalDateTime.now();

        List<AudioClip> clips = audioClipRepository.findByLessonIdOrderByOrder(lessonId);
        clips.forEach(clip -> clip.setDeletedAt(now));
        audioClipRepository.saveAll(clips);

        lesson.setDeletedAt(now);
        lesson.setUpdatedAt(now);
        lessonRepository.save(lesson);
    }

    @Override
    public Lesson getLessonEntityById(String lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Lesson not found"));
    }

    @Override
    public List<AudioClip> getAudioClipsByLessonId(String lessonId) {
        return audioClipRepository.findByLessonIdOrderByOrder(lessonId);
    }

    @Override
    public GradingResult verifyAnswers(String lessonId, List<SubmitProgressRequest.AnswerItem> answers) {
        List<AudioClip> clips = audioClipRepository.findByLessonIdOrderByOrder(lessonId);

        Map<String, Set<String>> clipEmotionsMap = clips.stream()
                .filter(c -> c.getEmotions() != null)
                .collect(Collectors.toMap(AudioClip::getId, c -> emotionKeys(c.getEmotions())));

        Map<String, Set<String>> userSelectionsByClip = new HashMap<>();
        for (SubmitProgressRequest.AnswerItem answer : answers) {
            userSelectionsByClip
                    .computeIfAbsent(answer.getAudioClipId(), k -> new HashSet<>())
                    .add(answer.getSelectedEmotion().toLowerCase());
        }

        Set<String> correctClips = new HashSet<>();
        for (Map.Entry<String, Set<String>> entry : userSelectionsByClip.entrySet()) {
            Set<String> valid = clipEmotionsMap.get(entry.getKey());
            if (valid == null) continue;
            Set<String> validLower = valid.stream().map(String::toLowerCase).collect(Collectors.toSet());
            if (entry.getValue().equals(validLower)) {
                correctClips.add(entry.getKey());
            }
        }

        int totalClips = clips.size();
        int score = totalClips > 0 ? (int) Math.round(correctClips.size() * 100.0 / totalClips) : 0;

        String answersJson;
        try {
            List<Map<String, Object>> enriched = clips.stream().map(clip -> {
                Set<String> valid = clipEmotionsMap.getOrDefault(clip.getId(), Set.of());
                List<String> userSelections = answers.stream()
                        .filter(a -> a.getAudioClipId().equals(clip.getId()))
                        .map(SubmitProgressRequest.AnswerItem::getSelectedEmotion)
                        .collect(Collectors.toList());
                boolean isCorrect = correctClips.contains(clip.getId());
                return Map.<String, Object>of(
                        "audioClipId",    clip.getId(),
                        "correctAnswers", valid,
                        "userAnswers",    userSelections,
                        "isCorrect",      isCorrect
                );
            }).collect(Collectors.toList());
            answersJson = objectMapper.writeValueAsString(Map.of("answers", enriched));
        } catch (JsonProcessingException e) {
            answersJson = "{\"answers\":[]}";
        }

        return GradingResult.builder().score(score).answersJson(answersJson).build();
    }

    private LessonResponse toLessonResponse(Lesson lesson) {
        int clipCount = audioClipRepository.findByLessonIdOrderByOrder(lesson.getId()).size();
        return LessonResponse.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .title(lesson.getTitle())
                .order(lesson.getOrder())
                .level(lesson.getLevel() != null ? lesson.getLevel().name() : null)
                .duration(lesson.getDuration())
                .status(lesson.getStatus().name())
                .audioClipCount(clipCount)
                .build();
    }

    private AudioClipResponse toAudioClipResponse(AudioClip clip) {
        return AudioClipResponse.builder()
                .id(clip.getId())
                .lessonId(clip.getLesson().getId())
                .subject(clip.getSubject())
                .audioUrl(clip.getAudioUrl())
                .duration(clip.getDuration())
                .emotions(clip.getEmotions())
                .order(clip.getOrder())
                .build();
    }

    @SuppressWarnings("unchecked")
    private Set<String> emotionKeys(String emotionsJson) {
        try {
            Map<String, Double> map = objectMapper.readValue(emotionsJson, Map.class);
            return map.keySet();
        } catch (JsonProcessingException e) {
            return Set.of();
        }
    }
}
