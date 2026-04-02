package com.emotionapp.backend.service;

import com.emotionapp.backend.entity.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class VNPayService {

    private static final DateTimeFormatter VNP_DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String hashSecret;

    @Value("${vnpay.payment-url}")
    private String paymentUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    public String buildPaymentUrl(Payment payment, String ipAddr) {
        LocalDateTime now = LocalDateTime.now();

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version",    "2.1.0");
        params.put("vnp_Command",    "pay");
        params.put("vnp_TmnCode",    tmnCode);
        params.put("vnp_Amount",     String.valueOf((long) payment.getAmount() * 100));
        params.put("vnp_CurrCode",   "VND");
        params.put("vnp_TxnRef",     payment.getId());
        params.put("vnp_OrderInfo",  "Thanh toan khoa hoc " + payment.getCourse().getId());
        params.put("vnp_OrderType",  "billpayment");
        params.put("vnp_Locale",     "vn");
        params.put("vnp_ReturnUrl",  returnUrl);
        params.put("vnp_IpAddr",     ipAddr);
        params.put("vnp_CreateDate", now.format(VNP_DATE_FMT));
        params.put("vnp_ExpireDate", now.plusMinutes(15).format(VNP_DATE_FMT));

        String queryStr = buildQueryString(params);
        String secureHash = hmacSha512(hashSecret, queryStr);
        return paymentUrl + "?" + queryStr + "&vnp_SecureHash=" + secureHash;
    }

    public boolean verifySignature(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null) return false;

        Map<String, String> filtered = new TreeMap<>(params);
        filtered.remove("vnp_SecureHash");
        filtered.remove("vnp_SecureHashType");

        String queryStr = buildQueryString(filtered);
        String expectedHash = hmacSha512(hashSecret, queryStr);
        return expectedHash.equalsIgnoreCase(receivedHash);
    }

    private String buildQueryString(Map<String, String> params) {
        return params.entrySet().stream()
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));
    }

    public String hmacSha512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to compute HMAC-SHA512", e);
        }
    }
}
