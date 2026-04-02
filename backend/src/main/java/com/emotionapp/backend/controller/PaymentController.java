package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.request.CreatePaymentRequest;
import com.emotionapp.backend.dto.response.ApiResponse;
import com.emotionapp.backend.dto.response.PaymentResponse;
import com.emotionapp.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ─── User APIs ────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @RequestBody CreatePaymentRequest request,
            HttpServletRequest httpRequest) {
        String userId = getCurrentUserId();
        String ipAddr = getClientIp(httpRequest);
        return ResponseEntity.ok(ApiResponse.success(
                paymentService.createPayment(userId, request, ipAddr)));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(
            @PathVariable String paymentId) {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                paymentService.getPaymentById(paymentId, userId)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getMyPayments() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                paymentService.getMyPayments(userId)));
    }

    // ─── VNPay Webhook / Return (Public — không cần JWT) ─────────────────────

    /**
     * IPN — VNPay server gọi vào (server-to-server).
     * SecurityConfig đã permitAll cho endpoint này.
     */
    @PostMapping("/callback/vnpay")
    public ResponseEntity<Map<String, String>> vnpayIPN(
            @RequestParam Map<String, String> params) {
        return ResponseEntity.ok(paymentService.handleIPN(params));
    }

    /**
     * Return URL — Browser redirect về sau khi user thanh toán xong / huỷ.
     * SecurityConfig đã permitAll cho endpoint này.
     */
    @GetMapping("/return/vnpay")
    public ResponseEntity<ApiResponse<PaymentResponse>> vnpayReturn(
            @RequestParam Map<String, String> params) {
        return ResponseEntity.ok(ApiResponse.success(
                paymentService.handleReturn(params)));
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        // X-Forwarded-For có thể chứa nhiều IP ngăn cách bằng dấu phẩy
        return ip.split(",")[0].trim();
    }
}
