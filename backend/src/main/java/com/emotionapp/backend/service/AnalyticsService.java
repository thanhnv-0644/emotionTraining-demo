package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.response.AdminAnalyticsResponse;
import com.emotionapp.backend.dto.response.UserAnalyticsResponse;
import com.emotionapp.backend.entity.Enrollment;
import com.emotionapp.backend.entity.Payment;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.entity.UserProgress;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.CourseRepository;
import com.emotionapp.backend.repository.EnrollmentRepository;
import com.emotionapp.backend.repository.LessonRepository;
import com.emotionapp.backend.repository.PaymentRepository;
import com.emotionapp.backend.repository.UserProgressRepository;
import com.emotionapp.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final UserProgressRepository userProgressRepository;
    private final LessonRepository lessonRepository;
    private final ObjectMapper objectMapper;

    public AdminAnalyticsResponse getAdminAnalytics(LocalDateTime from, LocalDateTime to) {
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("yyyy-MM");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minusDays(30);

        // ── Tổng quan ────────────────────────────────────────────────────────────
        List<User> allUsers = userRepository.findByDeletedAtIsNull();
        long totalUsers     = allUsers.size();
        long totalCourses   = courseRepository.findByDeletedAtIsNull().size();
        long totalLessons   = lessonRepository.findAll().stream()
                .filter(l -> l.getDeletedAt() == null).count();
        long totalEnrollments = enrollmentRepository.count();

        // ── Revenue ───────────────────────────────────────────────────────────────
        List<Payment> completedPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == Payment.Status.completed)
                .filter(p -> p.getPaidAt() != null)
                .filter(p -> (from == null || !p.getPaidAt().isBefore(from))
                          && (to   == null || !p.getPaidAt().isAfter(to)))
                .collect(Collectors.toList());

        long totalRevenue = completedPayments.stream().mapToLong(Payment::getAmount).sum();

        // Revenue by month (last 12 months, fill gaps with 0)
        Map<String, Long> revenueMap = new LinkedHashMap<>();
        for (int i = 11; i >= 0; i--) {
            revenueMap.put(now.minusMonths(i).format(monthFmt), 0L);
        }
        for (Payment p : completedPayments) {
            String month = p.getPaidAt().format(monthFmt);
            revenueMap.computeIfPresent(month, (k, v) -> v + p.getAmount());
        }
        List<AdminAnalyticsResponse.MonthlyRevenue> revenueByMonth = revenueMap.entrySet().stream()
                .map(e -> AdminAnalyticsResponse.MonthlyRevenue.builder()
                        .month(e.getKey()).revenue(e.getValue()).build())
                .collect(Collectors.toList());

        // ── Người dùng ────────────────────────────────────────────────────────────
        // New users last 30 days
        long newUsersLast30Days = userRepository
                .findByCreatedAtAfterAndDeletedAtIsNull(thirtyDaysAgo).size();

        // Active users last 30 days (distinct userId with progress)
        Set<String> activeUserIds = userProgressRepository
                .findByCompletedAtAfter(thirtyDaysAgo).stream()
                .map(p -> p.getUser().getId())
                .collect(Collectors.toSet());
        long activeUsersLast30Days = activeUserIds.size();

        // Role distribution
        Map<String, Long> roleDistribution = allUsers.stream()
                .collect(Collectors.groupingBy(u -> u.getRole().name(), Collectors.counting()));

        // User growth — last 12 months
        Map<String, Long> growthMap = new LinkedHashMap<>();
        for (int i = 11; i >= 0; i--) {
            growthMap.put(now.minusMonths(i).format(monthFmt), 0L);
        }
        for (User u : allUsers) {
            if (u.getCreatedAt() == null) continue;
            String month = u.getCreatedAt().format(monthFmt);
            growthMap.computeIfPresent(month, (k, v) -> v + 1);
        }
        List<AdminAnalyticsResponse.MonthlyCount> userGrowth = growthMap.entrySet().stream()
                .map(e -> AdminAnalyticsResponse.MonthlyCount.builder()
                        .month(e.getKey()).count(e.getValue()).build())
                .collect(Collectors.toList());

        // ── Average system score ──────────────────────────────────────────────────
        List<UserProgress> allCompleted = userProgressRepository.findByCompletedAtIsNotNull();
        double avgSystemScore = allCompleted.stream()
                .filter(p -> p.getScore() != null)
                .mapToInt(UserProgress::getScore)
                .average()
                .orElse(0.0);
        avgSystemScore = Math.round(avgSystemScore * 10.0) / 10.0;

        // ── Emotion accuracy ──────────────────────────────────────────────────────
        Map<String, Double> emotionAccuracy = calcEmotionAccuracyPercent(allCompleted);

        // ── Top courses ───────────────────────────────────────────────────────────
        List<Enrollment> allEnrollments = enrollmentRepository.findAll();

        // enrollments per course
        Map<String, Long> enrollByCourseid = allEnrollments.stream()
                .collect(Collectors.groupingBy(e -> e.getCourse().getId(), Collectors.counting()));

        // revenue per course
        Map<String, Long> revenuePerCourse = completedPayments.stream()
                .collect(Collectors.groupingBy(p -> p.getCourse().getId(),
                        Collectors.summingLong(Payment::getAmount)));

        // avgScore per course (via lessons belonging to course)
        Map<String, List<Integer>> scoresByCourse = new HashMap<>();
        for (UserProgress p : allCompleted) {
            if (p.getScore() == null) continue;
            String courseId = p.getLesson().getCourse().getId();
            scoresByCourse.computeIfAbsent(courseId, k -> new ArrayList<>()).add(p.getScore());
        }

        List<AdminAnalyticsResponse.TopCourse> topCourses = enrollByCourseid.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    String cId = e.getKey();
                    String title = allEnrollments.stream()
                            .filter(en -> en.getCourse().getId().equals(cId))
                            .findFirst()
                            .map(en -> en.getCourse().getTitle())
                            .orElse("");
                    long rev = revenuePerCourse.getOrDefault(cId, 0L);
                    List<Integer> scores = scoresByCourse.getOrDefault(cId, List.of());
                    double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0.0);
                    return AdminAnalyticsResponse.TopCourse.builder()
                            .courseId(cId)
                            .title(title)
                            .enrollments(e.getValue())
                            .revenue(rev)
                            .avgScore(Math.round(avg * 10.0) / 10.0)
                            .build();
                })
                .collect(Collectors.toList());

        return AdminAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalCourses(totalCourses)
                .totalEnrollments(totalEnrollments)
                .totalRevenue(totalRevenue)
                .totalLessons(totalLessons)
                .avgSystemScore(avgSystemScore)
                .newUsersLast30Days(newUsersLast30Days)
                .activeUsersLast30Days(activeUsersLast30Days)
                .roleDistribution(roleDistribution)
                .revenueByMonth(revenueByMonth)
                .userGrowth(userGrowth)
                .emotionAccuracy(emotionAccuracy)
                .topCourses(topCourses)
                .build();
    }

    public UserAnalyticsResponse getUserAnalytics(String userId) {
        com.emotionapp.backend.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        List<UserProgress> progresses = userProgressRepository.findCompletedByUserId(userId);

        long totalLessonsCompleted = progresses.size();

        double avgScore = progresses.stream()
                .filter(p -> p.getScore() != null)
                .mapToInt(UserProgress::getScore)
                .average()
                .orElse(0.0);

        Map<String, int[]> emotionStats = new HashMap<>();
        for (UserProgress p : progresses) {
            if (p.getAnswers() == null) continue;
            try {
                JsonNode root = objectMapper.readTree(p.getAnswers());
                JsonNode answers = root.get("answers");
                if (answers == null || !answers.isArray()) continue;
                for (JsonNode answer : answers) {
                    String correctAnswer = answer.path("correctAnswer").asText(null);
                    String userAnswer    = answer.path("userAnswer").asText(null);
                    if (correctAnswer == null) continue;
                    emotionStats.computeIfAbsent(correctAnswer, k -> new int[]{0, 0});
                    emotionStats.get(correctAnswer)[1]++;
                    if (correctAnswer.equals(userAnswer)) emotionStats.get(correctAnswer)[0]++;
                }
            } catch (Exception e) {
                log.warn("Failed to parse answers for progress {}", p.getId());
            }
        }

        Map<String, UserAnalyticsResponse.EmotionStat> emotionAccuracy = new HashMap<>();
        for (Map.Entry<String, int[]> entry : emotionStats.entrySet()) {
            int correct = entry.getValue()[0];
            int total   = entry.getValue()[1];
            double accuracy = total > 0 ? Math.round((correct * 100.0 / total) * 10.0) / 10.0 : 0.0;
            emotionAccuracy.put(entry.getKey(), UserAnalyticsResponse.EmotionStat.builder()
                    .correct(correct).total(total).accuracy(accuracy).build());
        }

        String weakestEmotion = emotionAccuracy.entrySet().stream()
                .filter(e -> e.getValue().getTotal() > 0)
                .min(Comparator.comparingDouble(e -> e.getValue().getAccuracy()))
                .map(Map.Entry::getKey).orElse(null);

        String strongestEmotion = emotionAccuracy.entrySet().stream()
                .filter(e -> e.getValue().getTotal() > 0)
                .max(Comparator.comparingDouble(e -> e.getValue().getAccuracy()))
                .map(Map.Entry::getKey).orElse(null);

        return UserAnalyticsResponse.builder()
                .totalLessonsCompleted(totalLessonsCompleted)
                .avgScore(Math.round(avgScore * 10.0) / 10.0)
                .totalXp(user.getXp())
                .emotionAccuracy(emotionAccuracy)
                .weakestEmotion(weakestEmotion)
                .strongestEmotion(strongestEmotion)
                .build();
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private static final List<String> ALL_EMOTIONS =
            List.of("happiness", "sadness", "anger", "fear", "surprise", "disgust", "neutral");

    private Map<String, Double> calcEmotionAccuracyPercent(List<UserProgress> progresses) {
        Map<String, int[]> stats = new HashMap<>();
        // Seed all 7 emotions so the radar always has every axis
        for (String emotion : ALL_EMOTIONS) {
            stats.put(emotion, new int[]{0, 0});
        }
        for (UserProgress p : progresses) {
            if (p.getAnswers() == null) continue;
            try {
                JsonNode root = objectMapper.readTree(p.getAnswers());
                JsonNode answers = root.get("answers");
                if (answers == null || !answers.isArray()) continue;
                for (JsonNode answer : answers) {
                    String correctAnswer = answer.path("correctAnswer").asText(null);
                    String userAnswer    = answer.path("userAnswer").asText(null);
                    if (correctAnswer == null) continue;
                    stats.computeIfAbsent(correctAnswer, k -> new int[]{0, 0});
                    stats.get(correctAnswer)[1]++;
                    if (correctAnswer.equals(userAnswer)) stats.get(correctAnswer)[0]++;
                }
            } catch (Exception e) {
                log.warn("Failed to parse answers for progress {}", p.getId());
            }
        }

        Map<String, Double> result = new HashMap<>();
        for (Map.Entry<String, int[]> entry : stats.entrySet()) {
            int correct = entry.getValue()[0];
            int total   = entry.getValue()[1];
            result.put(entry.getKey(), total > 0 ? Math.round((correct * 100.0 / total) * 10.0) / 10.0 : 0.0);
        }
        return result;
    }
}
