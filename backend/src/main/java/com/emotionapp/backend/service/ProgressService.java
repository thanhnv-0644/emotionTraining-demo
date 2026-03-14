package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.SubmitProgressRequest;
import com.emotionapp.backend.dto.response.ProgressResponse;
import com.emotionapp.backend.entity.AudioClip;
import com.emotionapp.backend.entity.Lesson;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.entity.UserProgress;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.AudioClipRepository;
import com.emotionapp.backend.repository.LessonRepository;
import com.emotionapp.backend.repository.UserProgressRepository;
import com.emotionapp.backend.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserProgressRepository userProgressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final AudioClipRepository audioClipRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ProgressResponse submitProgress(String lessonId, String userId, SubmitProgressRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Lesson not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        // Calculate score: count answers matching targetEmotion of each audio clip
        List<AudioClip> clips = audioClipRepository.findByLessonIdOrderByOrder(lessonId);
        Map<String, String> clipEmotionMap = clips.stream()
                .filter(c -> c.getTargetEmotion() != null)
                .collect(Collectors.toMap(
                        AudioClip::getId,
                        c -> c.getTargetEmotion().name()
                ));

        int score = 0;
        for (SubmitProgressRequest.AnswerItem answer : request.getAnswers()) {
            String expected = clipEmotionMap.get(answer.getAudioClipId());
            if (expected != null && expected.equalsIgnoreCase(answer.getSelectedEmotion())) {
                score++;
            }
        }

        // Determine attempt number
        List<UserProgress> previousAttempts = userProgressRepository.findByUserIdAndLessonId(userId, lessonId);
        int attemptNumber = previousAttempts.size() + 1;

        // Serialize answers to JSON
        String answersJson;
        try {
            answersJson = objectMapper.writeValueAsString(request.getAnswers());
        } catch (JsonProcessingException e) {
            answersJson = "[]";
        }

        UserProgress progress = UserProgress.builder()
                .id(IdGenerator.generateId())
                .user(user)
                .lesson(lesson)
                .attemptNumber(attemptNumber)
                .score(score)
                .completedAt(LocalDateTime.now())
                .answers(answersJson)
                .createdAt(LocalDateTime.now())
                .build();

        userProgressRepository.save(progress);

        // Award XP for completing a lesson (10 XP per completion, bonus for good score)
        int xpGain = 10 + (score * 2);
        user.setXp((user.getXp() == null ? 0 : user.getXp()) + xpGain);
        userRepository.save(user);

        return toResponse(progress);
    }

    public List<ProgressResponse> getMyProgress(String userId) {
        return userProgressRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProgressResponse> getProgressByLesson(String lessonId, String userId) {
        return userProgressRepository.findByUserIdAndLessonId(userId, lessonId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ProgressResponse toResponse(UserProgress p) {
        return ProgressResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .lessonId(p.getLesson().getId())
                .attemptNumber(p.getAttemptNumber())
                .score(p.getScore())
                .completedAt(p.getCompletedAt())
                .answers(p.getAnswers())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
