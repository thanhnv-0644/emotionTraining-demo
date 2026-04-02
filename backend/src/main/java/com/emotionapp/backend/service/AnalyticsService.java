package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.response.AdminAnalyticsResponse;
import com.emotionapp.backend.dto.response.UserAnalyticsResponse;
import com.emotionapp.backend.entity.Enrollment;
import com.emotionapp.backend.entity.Payment;
import com.emotionapp.backend.entity.UserProgress;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.CourseRepository;
import com.emotionapp.backend.repository.EnrollmentRepository;
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
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final ObjectMapper objectMapper;

    public AdminAnalyticsResponse getAdminAnalytics(LocalDateTime from, LocalDateTime to) {
        // Totals
        long totalUsers       = userRepository.findByDeletedAtIsNull().size();
        long totalCourses     = courseRepository.findByDeletedAtIsNull().size();
        long totalEnrollments = enrollmentRepository.count();

        // Revenue từ completed payments trong khoảng thời gian
        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == Payment.Status.completed)
                .filter(p -> p.getPaidAt() != null)
                .filter(p -> (from == null || !p.getPaidAt().isBefore(from))
                          && (to == null   || !p.getPaidAt().isAfter(to)))
                .collect(Collectors.toList());

        long totalRevenue = payments.stream().mapToLong(Payment::getAmount).sum();

        // Revenue by month
        Map<String, Long> revenueMap = new HashMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        for (Payment p : payments) {
            String month = p.getPaidAt().format(fmt);
            revenueMap.merge(month, (long) p.getAmount(), Long::sum);
        }
        List<AdminAnalyticsResponse.MonthlyRevenue> revenueByMonth = revenueMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> AdminAnalyticsResponse.MonthlyRevenue.builder()
                        .month(e.getKey())
                        .revenue(e.getValue())
                        .build())
                .collect(Collectors.toList());

        // Top courses by enrollment
        List<Enrollment> allEnrollments = enrollmentRepository.findAll();
        Map<String, Long> enrollByCourseid = allEnrollments.stream()
                .collect(Collectors.groupingBy(e -> e.getCourse().getId(), Collectors.counting()));
        List<AdminAnalyticsResponse.TopCourse> topCourses = enrollByCourseid.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    String courseId = e.getKey();
                    String title = allEnrollments.stream()
                            .filter(en -> en.getCourse().getId().equals(courseId))
                            .findFirst()
                            .map(en -> en.getCourse().getTitle())
                            .orElse("");
                    return AdminAnalyticsResponse.TopCourse.builder()
                            .courseId(courseId)
                            .title(title)
                            .enrollments(e.getValue())
                            .build();
                })
                .collect(Collectors.toList());

        // Emotion accuracy toàn hệ thống
        List<UserProgress> allProgress = userProgressRepository.findByCompletedAtIsNotNull();
        Map<String, Double> emotionAccuracy = calcEmotionAccuracyPercent(allProgress);

        return AdminAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalCourses(totalCourses)
                .totalEnrollments(totalEnrollments)
                .totalRevenue(totalRevenue)
                .revenueByMonth(revenueByMonth)
                .topCourses(topCourses)
                .emotionAccuracy(emotionAccuracy)
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

        // Emotion accuracy per emotion
        Map<String, int[]> emotionStats = new HashMap<>(); // [correct, total]
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
                    emotionStats.get(correctAnswer)[1]++; // total
                    if (correctAnswer.equals(userAnswer)) {
                        emotionStats.get(correctAnswer)[0]++; // correct
                    }
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
                    .correct(correct)
                    .total(total)
                    .accuracy(accuracy)
                    .build());
        }

        String weakestEmotion  = emotionAccuracy.entrySet().stream()
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

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Map<String, Double> calcEmotionAccuracyPercent(List<UserProgress> progresses) {
        Map<String, int[]> stats = new HashMap<>();
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
