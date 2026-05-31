package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.SubmitProgressRequest;
import com.emotionapp.backend.dto.response.GradingResult;
import com.emotionapp.backend.dto.response.ProgressResponse;
import com.emotionapp.backend.entity.Lesson;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.entity.UserProgress;
import com.emotionapp.backend.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProgressServiceImpl implements IProgressService {

    private final UserProgressRepository userProgressRepository;
    private final ILessonService lessonService;
    private final IUserService userService;

    @Override
    @Transactional
    public ProgressResponse submitProgress(String lessonId, String userId, SubmitProgressRequest request) {
        Lesson lesson = lessonService.getLessonEntityById(lessonId);
        User user = userService.getUserEntityById(userId);

        int attemptNumber = (int) userProgressRepository.countByUserIdAndLessonId(userId, lessonId) + 1;

        GradingResult grading = lessonService.verifyAnswers(lessonId, request.getAnswers());

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

        if (attemptNumber == 1) {
            int baseXp = switch (lesson.getLevel()) {
                case intermediate -> 20;
                case advanced     -> 30;
                default           -> 10;
            };
            int xpGain = baseXp + (grading.getScore() >= 80 ? baseXp / 2 : 0);
            userService.addXp(userId, xpGain);
        }

        return toResponse(progress);
    }

    @Override
    public List<ProgressResponse> getMyProgress(String userId) {
        return userProgressRepository.findByUserId(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProgressResponse> getProgressByLesson(String lessonId, String userId) {
        return userProgressRepository.findByUserIdAndLessonId(userId, lessonId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ProgressResponse toResponse(UserProgress p) {
        return ProgressResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .userName(p.getUser().getName())
                .lessonId(p.getLesson().getId())
                .lessonTitle(p.getLesson().getTitle())
                .attemptNumber(p.getAttemptNumber())
                .score(p.getScore())
                .completedAt(p.getCompletedAt())
                .answers(p.getAnswers())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
