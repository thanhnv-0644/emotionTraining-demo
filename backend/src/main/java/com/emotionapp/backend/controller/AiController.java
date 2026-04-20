package com.emotionapp.backend.controller;

import com.emotionapp.backend.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/ai")
public class AiController {

    private static final String AI_SERVICE_URL = "http://localhost:8000/predict";

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping(value = "/predict", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<List<?>>> predict(
            @RequestParam("files") List<MultipartFile> files) {

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No files provided"));
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            for (MultipartFile file : files) {
                byte[] bytes = file.getBytes();
                String filename = file.getOriginalFilename() != null
                        ? file.getOriginalFilename() : "audio.wav";

                ByteArrayResource resource = new ByteArrayResource(bytes) {
                    @Override public String getFilename() { return filename; }
                };
                body.add("files", resource);
            }

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<List<Object>> response = restTemplate.exchange(
                    AI_SERVICE_URL, HttpMethod.POST, request,
                    new org.springframework.core.ParameterizedTypeReference<List<Object>>() {});

            return ResponseEntity.ok(ApiResponse.success(response.getBody()));

        } catch (ResourceAccessException e) {
            log.error("AI service unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponse.error("AI service chưa được khởi động. Vui lòng chạy inference_server.py"));
        } catch (IOException e) {
            log.error("Failed to read uploaded file: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Không thể đọc file audio"));
        }
    }
}
