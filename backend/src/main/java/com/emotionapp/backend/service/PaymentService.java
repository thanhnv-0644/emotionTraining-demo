package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.CreatePaymentRequest;
import com.emotionapp.backend.dto.response.PaymentResponse;
import com.emotionapp.backend.entity.Course;
import com.emotionapp.backend.entity.Enrollment;
import com.emotionapp.backend.entity.Payment;
import com.emotionapp.backend.entity.User;
import com.emotionapp.backend.exception.AppException;
import com.emotionapp.backend.repository.CourseRepository;
import com.emotionapp.backend.repository.EnrollmentRepository;
import com.emotionapp.backend.repository.PaymentRepository;
import com.emotionapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final VNPayService vnPayService;

    // ─── User APIs ────────────────────────────────────────────────────────────

    @Transactional
    public PaymentResponse createPayment(String userId, CreatePaymentRequest request, String ipAddr) {
        String courseId = request.getCourseId();

        // 1. Đã enrolled rồi → 409
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new AppException(HttpStatus.CONFLICT, "Already enrolled in this course");
        }

        // 2. Đã có pending payment → trả về cái cũ kèm paymentUrl mới
        Payment existing = paymentRepository
                .findByUserIdAndCourseIdAndStatus(userId, courseId, Payment.Status.pending)
                .orElse(null);
        if (existing != null) {
            String url = vnPayService.buildPaymentUrl(existing, ipAddr);
            return toResponse(existing, url);
        }

        // 3. Lấy course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Course not found"));
        if (course.isFree()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Course is free, no payment required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

        // 4. Tạo payment mới
        LocalDateTime now = LocalDateTime.now();
        Payment payment = Payment.builder()
                .id("pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10))
                .user(user)
                .course(course)
                .amount(course.getPrice())
                .currency("VND")
                .method(Payment.Method.vnpay)
                .status(Payment.Status.pending)
                .expiredAt(now.plusMinutes(15))
                .createdAt(now)
                .updatedAt(now)
                .build();

        paymentRepository.save(payment);

        String paymentUrl = vnPayService.buildPaymentUrl(payment, ipAddr);
        return toResponse(payment, paymentUrl);
    }

    public PaymentResponse getPaymentById(String paymentId, String userId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Payment not found"));
        if (!payment.getUser().getId().equals(userId)) {
            throw new AppException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return toResponse(payment, null);
    }

    public List<PaymentResponse> getMyPayments(String userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(p -> toResponse(p, null))
                .collect(Collectors.toList());
    }

    // ─── VNPay Webhook / Return ───────────────────────────────────────────────

    /**
     * IPN — VNPay server gọi vào để xác nhận kết quả thanh toán.
     * Phải trả về {"RspCode":"00"} để VNPay biết đã nhận thành công.
     */
    @Transactional
    public Map<String, String> handleIPN(Map<String, String> params) {
        // 1. Verify signature
        if (!vnPayService.verifySignature(params)) {
            return Map.of("RspCode", "97", "Message", "Invalid signature");
        }

        String txnRef          = params.get("vnp_TxnRef");
        String responseCode    = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");
        String vnpTransactionNo = params.get("vnp_TransactionNo");
        long   vnpAmount       = Long.parseLong(params.get("vnp_Amount"));

        // 2. Tìm payment
        Payment payment = paymentRepository.findById(txnRef).orElse(null);
        if (payment == null) {
            return Map.of("RspCode", "01", "Message", "Order not found");
        }

        // 3. Idempotent — đã xử lý rồi
        if (payment.getStatus() != Payment.Status.pending) {
            return Map.of("RspCode", "02", "Message", "Order already confirmed");
        }

        // 4. Kiểm tra amount
        if (vnpAmount != (long) payment.getAmount() * 100) {
            return Map.of("RspCode", "04", "Message", "Invalid amount");
        }

        LocalDateTime now = LocalDateTime.now();

        // 5. Xử lý kết quả
        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            payment.setStatus(Payment.Status.completed);
            payment.setTransactionId(vnpTransactionNo);
            payment.setPaidAt(now);
            payment.setUpdatedAt(now);
            paymentRepository.save(payment);

            // Tạo enrollment trong cùng transaction
            Enrollment enrollment = Enrollment.builder()
                    .id("enroll_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10))
                    .user(payment.getUser())
                    .course(payment.getCourse())
                    .payment(payment)
                    .status(Enrollment.Status.active)
                    .createdAt(now)
                    .build();
            enrollmentRepository.save(enrollment);

            log.info("Payment {} completed, enrollment created for user {} course {}",
                    payment.getId(), payment.getUser().getId(), payment.getCourse().getId());
        } else {
            payment.setStatus(Payment.Status.failed);
            payment.setFailureReason("vnp_ResponseCode=" + responseCode + ", vnp_TransactionStatus=" + transactionStatus);
            payment.setUpdatedAt(now);
            paymentRepository.save(payment);

            log.warn("Payment {} failed with responseCode={}", payment.getId(), responseCode);
        }

        return Map.of("RspCode", "00", "Message", "Confirm Success");
    }

    /**
     * Return URL — Browser redirect về sau khi user hoàn tất / huỷ trên trang VNPay.
     * Chỉ cập nhật status nếu payment vẫn đang pending (IPN có thể đến trước).
     */
    @Transactional
    public PaymentResponse handleReturn(Map<String, String> params) {
        if (!vnPayService.verifySignature(params)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Invalid signature");
        }

        String txnRef      = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        Payment payment = paymentRepository.findById(txnRef)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Payment not found"));

        LocalDateTime now = LocalDateTime.now();
        String transactionStatus = params.get("vnp_TransactionStatus");
        String vnpTransactionNo  = params.get("vnp_TransactionNo");
        boolean isSuccess = "00".equals(responseCode) && "00".equals(transactionStatus);

        if (payment.getStatus() == Payment.Status.completed) {
            // IPN đã xử lý thành công trước → trả về luôn
            return toResponse(payment, null);
        }

        if (isSuccess) {
            // Thanh toán thành công — VNPay cho thử lại nhiều lần trong 1 phiên,
            // nên status có thể đang là cancelled/failed từ lần huỷ trước.
            payment.setStatus(Payment.Status.completed);
            payment.setTransactionId(vnpTransactionNo);
            payment.setPaidAt(now);
            payment.setUpdatedAt(now);
            paymentRepository.save(payment);

            // Tạo enrollment nếu chưa có
            if (!enrollmentRepository.existsByUserIdAndCourseId(
                    payment.getUser().getId(), payment.getCourse().getId())) {
                Enrollment enrollment = Enrollment.builder()
                        .id("enroll_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10))
                        .user(payment.getUser())
                        .course(payment.getCourse())
                        .payment(payment)
                        .status(Enrollment.Status.active)
                        .createdAt(now)
                        .build();
                enrollmentRepository.save(enrollment);
                log.info("Return URL: enrollment created for user {} course {}",
                        payment.getUser().getId(), payment.getCourse().getId());
            }
        } else if (payment.getStatus() == Payment.Status.pending) {
            // Chỉ set cancelled/failed nếu còn pending (tránh ghi đè completed từ IPN)
            if ("24".equals(responseCode)) {
                payment.setStatus(Payment.Status.cancelled);
            } else {
                payment.setStatus(Payment.Status.failed);
                payment.setFailureReason("vnp_ResponseCode=" + responseCode);
            }
            payment.setUpdatedAt(now);
            paymentRepository.save(payment);
        }

        return toResponse(payment, null);
    }

    // ─── Cron Jobs ────────────────────────────────────────────────────────────

    /**
     * Mỗi 15 phút: set expired cho các pending payment quá hạn.
     */
    @Scheduled(fixedRate = 15 * 60 * 1000)
    @Transactional
    public void expirePendingPayments() {
        List<Payment> overdueList = paymentRepository
                .findByStatusAndExpiredAtBefore(Payment.Status.pending, LocalDateTime.now());
        if (overdueList.isEmpty()) return;

        LocalDateTime now = LocalDateTime.now();
        for (Payment p : overdueList) {
            p.setStatus(Payment.Status.expired);
            p.setUpdatedAt(now);
        }
        paymentRepository.saveAll(overdueList);
        log.info("Expired {} pending payment(s)", overdueList.size());
    }

    /**
     * Mỗi 5 phút: query VNPay QueryDR cho các pending payment tồn tại hơn 10 phút.
     * Dùng để bắt các trường hợp IPN bị delay/fail từ phía VNPay.
     */
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void queryStalePayments() {
        List<Payment> stale = paymentRepository
                .findByStatusAndCreatedAtBefore(Payment.Status.pending, LocalDateTime.now().minusMinutes(10));
        if (stale.isEmpty()) return;

        log.info("Found {} stale pending payment(s) to query from VNPay", stale.size());
        for (Payment payment : stale) {
            // TODO: gọi VNPay QueryDR API và đồng bộ kết quả
            // vnPayService.queryTransaction(payment, serverIp);
            log.debug("Should query VNPay for payment {}", payment.getId());
        }
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────

    private PaymentResponse toResponse(Payment p, String paymentUrl) {
        return PaymentResponse.builder()
                .id(p.getId())
                .courseId(p.getCourse().getId())
                .courseTitle(p.getCourse().getTitle())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .method(p.getMethod().name())
                .status(p.getStatus().name())
                .transactionId(p.getTransactionId())
                .failureReason(p.getFailureReason())
                .paidAt(p.getPaidAt())
                .expiredAt(p.getExpiredAt())
                .createdAt(p.getCreatedAt())
                .paymentUrl(paymentUrl)
                .build();
    }
}
