package com.emotionapp.backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IAiService {
    List<?> predict(List<MultipartFile> files);
}
