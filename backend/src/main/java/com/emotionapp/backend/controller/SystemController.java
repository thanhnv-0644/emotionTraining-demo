package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.CleanupPreviewResponse;
import com.emotionapp.backend.dto.response.SystemHealthResponse;
import com.emotionapp.backend.entity.SystemConfig;
import com.emotionapp.backend.repository.CourseRepository;
import com.emotionapp.backend.repository.LessonRepository;
import com.emotionapp.backend.repository.PaymentRepository;
import com.emotionapp.backend.repository.SystemConfigRepository;
import com.emotionapp.backend.repository.UserProgressRepository;
import com.emotionapp.backend.repository.UserRepository;
import com.emotionapp.backend.service.PaymentService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.lang.management.ManagementFactory;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/system")
@RequiredArgsConstructor
public class SystemController {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserProgressRepository progressRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;
    private final SystemConfigRepository configRepository;
    private final ObjectMapper objectMapper;

    private static final String XP_KEY = "xp_levels";
    private static final String DEFAULT_XP_JSON =
        "[{\"xp\":0,\"label\":\"Người mới\",\"icon\":\"emoji_nature\",\"color\":\"text-slate-500\"}," +
        "{\"xp\":100,\"label\":\"Người học\",\"icon\":\"school\",\"color\":\"text-green-600\"}," +
        "{\"xp\":300,\"label\":\"Người thực hành\",\"icon\":\"psychology\",\"color\":\"text-blue-600\"}," +
        "{\"xp\":700,\"label\":\"Chuyên gia\",\"icon\":\"workspace_premium\",\"color\":\"text-purple-600\"}," +
        "{\"xp\":1500,\"label\":\"Bậc thầy\",\"icon\":\"military_tech\",\"color\":\"text-yellow-600\"}," +
        "{\"xp\":3000,\"label\":\"Huyền thoại\",\"icon\":\"stars\",\"color\":\"text-orange-600\"}]";

    // ── Health ────────────────────────────────────────────────────────────────

    @GetMapping("/health")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<SystemHealthResponse>> getHealth() {
        boolean aiOnline = pingAiService();
        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;

        SystemHealthResponse health = SystemHealthResponse.builder()
                .aiServiceOnline(aiOnline)
                .aiServiceUrl(aiServiceUrl)
                .aiModelName("emotion2vec_viet_finetuned")
                .uptimeSeconds(uptimeSeconds)
                .totalUsers(userRepository.count())
                .totalCourses(courseRepository.count())
                .totalLessons(lessonRepository.count())
                .totalProgress(progressRepository.count())
                .totalPayments(paymentRepository.count())
                .build();

        return ResponseEntity.ok(ApiResponse.success(health));
    }

    // ── Cleanup ───────────────────────────────────────────────────────────────

    @GetMapping("/cleanup/preview")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<CleanupPreviewResponse>> previewCleanup() {
        long count = paymentService.previewCleanup();
        return ResponseEntity.ok(ApiResponse.success(
                CleanupPreviewResponse.builder()
                        .paymentsToDelete(count)
                        .daysThreshold(3)
                        .build()));
    }

    @PostMapping("/cleanup/payments")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeCleanup() {
        int deleted = paymentService.manualCleanup();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("deleted", deleted);
        result.put("message", deleted > 0
                ? "Đã xoá " + deleted + " payment cũ"
                : "Không có payment nào cần xoá");
        return ResponseEntity.ok(ApiResponse.success("Dọn dẹp hoàn tất", result));
    }

    // ── XP Config ─────────────────────────────────────────────────────────────

    @GetMapping("/config/xp")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getXpConfig() {
        String json = configRepository.findById(XP_KEY)
                .map(SystemConfig::getConfigValue)
                .orElse(DEFAULT_XP_JSON);
        try {
            List<Map<String, Object>> levels = objectMapper.readValue(json, new TypeReference<>() {});
            return ResponseEntity.ok(ApiResponse.success(levels));
        } catch (Exception e) {
            log.error("Failed to parse XP config, returning default", e);
            try {
                List<Map<String, Object>> levels = objectMapper.readValue(DEFAULT_XP_JSON, new TypeReference<>() {});
                return ResponseEntity.ok(ApiResponse.success(levels));
            } catch (Exception ex) {
                return ResponseEntity.ok(ApiResponse.success(List.of()));
            }
        }
    }

    @PutMapping("/config/xp")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> updateXpConfig(
            @RequestBody List<Map<String, Object>> levels) {
        try {
            String json = objectMapper.writeValueAsString(levels);
            configRepository.save(SystemConfig.builder()
                    .configKey(XP_KEY)
                    .configValue(json)
                    .updatedAt(LocalDateTime.now())
                    .build());
            return ResponseEntity.ok(ApiResponse.success("Đã lưu cấu hình XP", levels));
        } catch (Exception e) {
            log.error("Failed to save XP config", e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Lưu cấu hình thất bại"));
        }
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private boolean pingAiService() {
        try {
            String baseUrl = aiServiceUrl.replace("/predict", "") + "/health";
            HttpURLConnection conn = (HttpURLConnection) new URL(baseUrl).openConnection();
            conn.setConnectTimeout(2000);
            conn.setReadTimeout(2000);
            conn.setRequestMethod("GET");
            int code = conn.getResponseCode();
            conn.disconnect();
            return code == 200;
        } catch (Exception e) {
            return false;
        }
    }
}
