package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.SubmitProgressRequest;
import com.emotionapp.backend.dto.response.GradingResult;
import com.emotionapp.backend.dto.response.ProgressResponse;
import com.emotionapp.backend.entity.Lesson;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.entity.UserProgress;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.LessonRepository;
import com.emotionapp.backend.repository.UserProgressRepository;
import com.emotionapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProgressService {

    private final UserProgressRepository userProgressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final ILessonService lessonService;

    @Transactional
    public ProgressResponse submitProgress(String lessonId, String userId, SubmitProgressRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Lesson not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        GradingResult grading = lessonService.verifyAnswers(lessonId, request.getAnswers());

        List<UserProgress> previousAttempts = userProgressRepository.findByUserIdAndLessonId(userId, lessonId);
        int attemptNumber = previousAttempts.size() + 1;

        UserProgress progress = UserProgress.builder()
                .id(IdGenerator.generateId())
                .user(user)
                .lesson(lesson)
                .attemptNumber(attemptNumber)
                .score(grading.getScore())
                .completedAt(LocalDateTime.now())
                .answers(grading.getAnswersJson())
                .createdAt(LocalDateTime.now())
                .build();

        userProgressRepository.save(progress);

        int xpEarned = 0;
        if (attemptNumber == 1) {
            int baseXp = switch (lesson.getLevel()) {
                case intermediate -> 20;
                case advanced     -> 30;
                default           -> 10;
            };
            int bonus = grading.getScore() >= 80 ? baseXp / 2 : 0;
            xpEarned = baseXp + bonus;

            user.setXp((user.getXp() == null ? 0 : user.getXp()) + xpEarned);
            userRepository.save(user);
        }

        return toResponse(progress, xpEarned);
    }

    public List<ProgressResponse> getMyProgress(String userId) {
        return userProgressRepository.findByUserId(userId)
                .stream()
                .map(p -> toResponse(p, 0))
                .collect(Collectors.toList());
    }

    public List<ProgressResponse> getProgressByLesson(String lessonId, String userId) {
        return userProgressRepository.findByUserIdAndLessonId(userId, lessonId)
                .stream()
                .map(p -> toResponse(p, 0))
                .collect(Collectors.toList());
    }

    private ProgressResponse toResponse(UserProgress p, int xpEarned) {
        return ProgressResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .userName(p.getUser().getName())
                .lessonId(p.getLesson().getId())
                .lessonTitle(p.getLesson().getTitle())
                .attemptNumber(p.getAttemptNumber())
                .score(p.getScore())
                .xpEarned(xpEarned)
                .completedAt(p.getCompletedAt())
                .answers(p.getAnswers())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
