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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
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

        // Calculate score: any emotion present in the clip's emotions map is a valid answer
        List<AudioClip> clips = audioClipRepository.findByLessonIdOrderByOrder(lessonId);
        Map<String, Set<String>> clipEmotionsMap = clips.stream()
                .filter(c -> c.getEmotions() != null)
                .collect(Collectors.toMap(
                        AudioClip::getId,
                        c -> emotionKeys(c.getEmotions())
                ));

        // Group user selections per clip, then exact-match against valid emotions
        Map<String, Set<String>> userSelectionsByClip = new HashMap<>();
        for (SubmitProgressRequest.AnswerItem answer : request.getAnswers()) {
            if (answer.getAudioClipId() == null || answer.getSelectedEmotion() == null) {
                throw new AppException(HttpStatus.BAD_REQUEST,
                        "Each answer must have audioClipId and selectedEmotion");
            }
            userSelectionsByClip
                    .computeIfAbsent(answer.getAudioClipId(), k -> new HashSet<>())
                    .add(answer.getSelectedEmotion().toLowerCase());
        }

        // Correct only when user selected exactly the valid emotions (no more, no less)
        Set<String> correctClips = new HashSet<>();
        for (Map.Entry<String, Set<String>> entry : userSelectionsByClip.entrySet()) {
            Set<String> valid = clipEmotionsMap.get(entry.getKey());
            if (valid == null) continue;
            Set<String> validLower = valid.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            if (entry.getValue().equals(validLower)) {
                correctClips.add(entry.getKey());
            }
        }
        int totalClips = clips.size();
        int score = totalClips > 0 ? (int) Math.round(correctClips.size() * 100.0 / totalClips) : 0;

        // Determine attempt number
        List<UserProgress> previousAttempts = userProgressRepository.findByUserIdAndLessonId(userId, lessonId);
        int attemptNumber = previousAttempts.size() + 1;

        // Serialize answers to JSON — grouped by clip
        String answersJson;
        try {
            List<Map<String, Object>> enriched = clips.stream().map(clip -> {
                Set<String> valid = clipEmotionsMap.getOrDefault(clip.getId(), Set.of());
                List<String> userSelections = request.getAnswers().stream()
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

        // Chỉ cộng XP lần đầu hoàn thành
        if (attemptNumber == 1) {
            int baseXp = switch (lesson.getLevel()) {
                case intermediate -> 20;
                case advanced     -> 30;
                default           -> 10; // beginner
            };

            int bonus = score >= 80 ? baseXp / 2 : 0;
            int xpGain = baseXp + bonus;

            user.setXp((user.getXp() == null ? 0 : user.getXp()) + xpGain);
            userRepository.save(user);
        }

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
