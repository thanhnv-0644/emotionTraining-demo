package com.emotionapp.backend.service;

import com.emotionapp.backend.dto.request.CreateLessonRequest;
import com.emotionapp.backend.dto.request.SubmitProgressRequest;
import com.emotionapp.backend.dto.request.UpdateLessonRequest;
import com.emotionapp.backend.dto.response.GradingResult;
import com.emotionapp.backend.dto.response.LessonDetailResponse;
import com.emotionapp.backend.dto.response.LessonResponse;
import com.emotionapp.backend.entity.AudioClip;
import com.emotionapp.backend.entity.Lesson;

import java.util.List;

public interface ILessonService {
    List<LessonResponse> getLessonsByCourse(String courseId);
    LessonDetailResponse getLessonDetail(String lessonId, String userId);
    LessonResponse createLesson(String courseId, CreateLessonRequest request);
    LessonResponse updateLesson(String lessonId, UpdateLessonRequest request);
    void deleteLesson(String lessonId);
    Lesson getLessonEntityById(String lessonId);
    List<AudioClip> getAudioClipsByLessonId(String lessonId);
    GradingResult verifyAnswers(String lessonId, List<SubmitProgressRequest.AnswerItem> answers);
}
