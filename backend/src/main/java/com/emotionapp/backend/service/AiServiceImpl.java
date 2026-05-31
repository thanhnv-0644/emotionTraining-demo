package com.emotionapp.backend.service;

import com.emotionapp.backend.exception.AppException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
public class AiServiceImpl implements IAiService {

    @Value("${ai.service.url:http://localhost:8000/predict}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public List<?> predict(List<MultipartFile> files) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        for (MultipartFile file : files) {
            try {
                byte[] bytes = file.getBytes();
                String filename = file.getOriginalFilename() != null
                        ? file.getOriginalFilename() : "audio.wav";
                ByteArrayResource resource = new ByteArrayResource(bytes) {
                    @Override public String getFilename() { return filename; }
                };
                body.add("files", resource);
            } catch (IOException e) {
                log.error("Failed to read uploaded file: {}", e.getMessage());
                throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể đọc file audio: " + file.getOriginalFilename());
            }
        }

        try {
            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<List<Object>> response = restTemplate.exchange(
                    aiServiceUrl, HttpMethod.POST, request,
                    new ParameterizedTypeReference<List<Object>>() {});
            return response.getBody();
        } catch (ResourceAccessException e) {
            log.error("AI service unavailable: {}", e.getMessage());
            throw new AppException(HttpStatus.SERVICE_UNAVAILABLE, "AI service chưa được khởi động. Vui lòng chạy inference_server.py");
        }
    }
}
