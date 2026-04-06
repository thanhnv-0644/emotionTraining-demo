"use client";

import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import AppPageHeader from "@/components/AppPageHeader";

interface AudioClip {
  id: string;
  subject: string;
  scenario: string;
  duration: string;
  url?: string;
  targetEmotion?: string;
}

interface LessonSessionProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  audioClips: AudioClip[];
}

const EMOTIONS = [
  { id: "happiness", label: "Hạnh phúc", icon: "sentiment_very_satisfied", color: "yellow" },
  { id: "sadness", label: "Buồn bã", icon: "sentiment_dissatisfied", color: "blue" },
  { id: "anger", label: "Tức giận", icon: "mode_heat", color: "red" },
  { id: "fear", label: "Sợ hãi", icon: "ac_unit", color: "purple" },
  { id: "surprise", label: "Ngạc nhiên", icon: "priority_high", color: "orange" },
  { id: "disgust", label: "Ghê tởm", icon: "sick", color: "green" },
  { id: "neutral", label: "Bình thản", icon: "sentiment_neutral", color: "slate" },
];

const EMOTION_COLORS: Record<string, string> = {
  yellow: "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  blue: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  red: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400",
  purple: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  orange: "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  green: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  slate: "bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

function getEmotionColor(emotionId: string): string {
  const emotion = EMOTIONS.find((e) => e.id === emotionId);
  return emotion ? EMOTION_COLORS[emotion.color] ?? "" : "";
}

export default function LessonSession({
  courseId,
  lessonId,
  lessonTitle,
  audioClips,
}: LessonSessionProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [answers, setAnswers] = useState<Array<{ audioClipId: string; selectedEmotion: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentClip = audioClips[currentClipIndex];
  const isLastClip = currentClipIndex === audioClips.length - 1;

  // Reset audio when clip changes
  useEffect(() => {
    setIsPlaying(false);
    setPlaybackTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentClipIndex]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = async () => {
    if (!selectedEmotion) return;

    const newAnswers = [...answers, { audioClipId: currentClip.id, selectedEmotion }];
    setAnswers(newAnswers);

    if (isLastClip) {
      setIsSubmitting(true);
      try {
        await api.post(`/api/lessons/${lessonId}/progress`, { answers: newAnswers });
      } catch {
        // proceed anyway
      }

      // Build result data for the result page
      const resultAnswers = audioClips.map((clip, i) => {
        const ans = newAnswers[i];
        const isCorrect = ans?.selectedEmotion === clip.targetEmotion;
        return {
          question: clip.subject,
          selected: ans?.selectedEmotion ?? '',
          correct: clip.targetEmotion ?? '',
          status: isCorrect ? 'correct' as const : 'incorrect' as const,
        };
      });
      const correctCount = resultAnswers.filter(a => a.status === 'correct').length;
      const score = audioClips.length > 0 ? Math.round((correctCount / audioClips.length) * 100) : 0;

      sessionStorage.setItem('lessonResult', JSON.stringify({
        lessonTitle,
        score,
        totalQuestions: audioClips.length,
        correctAnswers: correctCount,
        answers: resultAnswers,
      }));

      setIsSubmitting(false);
      router.push(`/user/courses/${courseId}/lessons/${lessonId}/result`);
    } else {
      setCurrentClipIndex(currentClipIndex + 1);
      setSelectedEmotion(null);
    }
  };

  const handlePrevious = () => {
    if (currentClipIndex > 0) {
      setCurrentClipIndex(currentClipIndex - 1);
      setSelectedEmotion(null);
    }
  };

  const progressPercent = duration > 0 ? (playbackTime / duration) * 100 : 0;

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      {/* Hidden audio element */}
      {currentClip?.url && (
        <audio
          ref={audioRef}
          src={currentClip.url}
          onTimeUpdate={(e) => setPlaybackTime(Math.floor(e.currentTarget.currentTime))}
          onLoadedMetadata={(e) => setDuration(Math.floor(e.currentTarget.duration))}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <AppPageHeader>
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 text-primary">
            <span className="material-symbols-outlined text-3xl">psychology</span>
          </div>
          <h2 className="truncate text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
            Luyện nhận diện cảm xúc
          </h2>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/user/courses/${courseId}`)}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <span className="material-symbols-outlined text-base">close</span>
          Thoát
        </button>
      </AppPageHeader>

      <div className="flex flex-1 flex-col bg-slate-50/80 p-4 dark:bg-slate-950 lg:p-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
          {/* Progress Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{lessonTitle}</p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Clip {currentClipIndex + 1} / {audioClips.length}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{currentClip.subject}</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentClipIndex) / audioClips.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Audio Player Section */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6">
            <div className="w-full h-24 flex items-center justify-center gap-1">
              {[12, 16, 24, 32, 20, 28, 36, 40, 24, 16, 20, 28, 24, 12, 16, 8, 12, 16, 24, 20, 14, 10].map((height, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${i < Math.floor((progressPercent / 100) * 22) ? "bg-primary" : "bg-primary/30"}`}
                  style={{ width: "4px", height: `${height * 2}px` }}
                />
              ))}
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); }}
                className="size-12 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">replay_10</span>
              </button>
              <button
                onClick={handlePlayPause}
                disabled={!currentClip?.url}
                className="size-20 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-5xl">
                  {isPlaying ? "pause_circle" : "play_circle"}
                </span>
              </button>
              <button
                onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10); }}
                className="size-12 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">forward_10</span>
              </button>
            </div>
            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>{String(Math.floor(playbackTime / 60)).padStart(2, "0")}:{String(playbackTime % 60).padStart(2, "0")}</span>
                <span>{currentClip.duration}</span>
              </div>
              <div
                className="relative h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer"
                onClick={(e) => {
                  if (!audioRef.current || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  audioRef.current.currentTime = ratio * duration;
                }}
              >
                <div className="absolute h-full bg-primary rounded-full" style={{ width: `${progressPercent}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 size-4 bg-primary border-2 border-white dark:border-slate-900 rounded-full shadow-md" style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }} />
              </div>
            </div>
          </div>

          {/* Emotion Selection Grid */}
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-3">Chọn cảm xúc bạn nghe được:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    selectedEmotion === emotion.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <div className={`size-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${getEmotionColor(emotion.id)}`}>
                    <span className="material-symbols-outlined">{emotion.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{emotion.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentClipIndex === 0}
              className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 font-semibold hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Trước
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedEmotion || isSubmitting}
              className="flex items-center gap-2 px-10 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang nộp...
                </>
              ) : (
                <>
                  {isLastClip ? "Xem kết quả" : "Tiếp theo"}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
