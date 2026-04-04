"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

interface AudioClip {
  id: string;
  subject: string;
  scenario: string;
  duration: string;
  url?: string;
}

interface LessonSessionProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  audioClips: AudioClip[];
  clipIndex?: number;
  totalClips?: number;
}

const EMOTIONS = [
  {
    id: "happiness",
    label: "Happiness",
    icon: "sentiment_very_satisfied",
    color: "yellow",
  },
  {
    id: "sadness",
    label: "Sadness",
    icon: "sentiment_dissatisfied",
    color: "blue",
  },
  { id: "anger", label: "Anger", icon: "mode_heat", color: "red" },
  { id: "fear", label: "Fear", icon: "ac_unit", color: "purple" },
  { id: "surprise", label: "Surprise", icon: "priority_high", color: "orange" },
  { id: "disgust", label: "Disgust", icon: "sick", color: "green" },
  {
    id: "neutral",
    label: "Neutral",
    icon: "sentiment_neutral",
    color: "slate",
  },
];

export default function LessonSession({
  courseId,
  lessonId,
  lessonTitle,
  audioClips,
  clipIndex = 0,
  totalClips = audioClips.length,
}: LessonSessionProps) {
  const router = useRouter();
  const [currentClipIndex, setCurrentClipIndex] = useState(clipIndex);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [responseTimer, setResponseTimer] = useState(14);
  const [answers, setAnswers] = useState<
    Array<{ audioClipId: string; selectedEmotion: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentClip = audioClips[currentClipIndex];
  const isLastClip = currentClipIndex === audioClips.length - 1;

  const handleNext = async () => {
    if (!selectedEmotion) return;

    // Add current answer
    const newAnswers = [
      ...answers,
      { audioClipId: currentClip.id, selectedEmotion },
    ];
    setAnswers(newAnswers);

    if (isLastClip) {
      // Submit all answers to API
      try {
        setIsSubmitting(true);
        await api.post(`/api/lessons/${lessonId}/progress`, {
          answers: newAnswers,
        });
        router.push(`/courses/${courseId}/lessons/${lessonId}/result`);
      } catch (err) {
        console.error("Error submitting progress:", err);
        // Still redirect on error for now
        router.push(`/courses/${courseId}/lessons/${lessonId}/result`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentClipIndex(currentClipIndex + 1);
      setSelectedEmotion(null);
      setPlaybackTime(0);
      setResponseTimer(14);
    }
  };

  const handlePrevious = () => {
    if (currentClipIndex > 0) {
      setCurrentClipIndex(currentClipIndex - 1);
      setSelectedEmotion(null);
      setPlaybackTime(0);
      setResponseTimer(14);
    }
  };

  const getEmotionColor = (emotionId: string) => {
    const emotion = EMOTIONS.find((e) => e.id === emotionId);
    if (!emotion) return "";
    const colors: Record<string, string> = {
      yellow:
        "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      blue: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
      red: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400",
      purple:
        "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
      orange:
        "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
      green:
        "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400",
      slate:
        "bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400",
    };
    return colors[emotion.color] || "";
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <span className="material-symbols-outlined text-4xl">
              psychology
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
            Emotion Training
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 items-center">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
            <span className="material-symbols-outlined text-sm">timer</span>
            <span>
              Response Timer:{" "}
              {String(Math.floor(responseTimer / 60)).padStart(2, "0")}:
              {String(responseTimer % 60).padStart(2, "0")}
            </span>
          </div>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div
            className="bg-primary/20 bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-slate-800 shadow-sm"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBpUrkzPWedRgMuATBi1smwgOMaWgVlzEJ2J3Nl0mGcAYxaYgzkBYf6ddcHODXupFoPal9xC-GNkteAyIv59yJFS6dH13tPdXmMG-Cg37FiKrdJNwSCWLwPSQVZKfoeGeW1fa14-N2nfRmmENsB-QIwKNmB5ZHajje3OkfPAw_HsXRjdMjEFD8kYFH1wghWwf3geMgPnbRE9JswBK475_AML0eFni9CmkNQlxdE2n1x6cM_g7ys6A8BC6_iV8my8aTfma7B0VoEqewo")',
            }}
          ></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark p-4 lg:p-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
          {/* Progress Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Clip {currentClipIndex + 1} of {totalClips}
                </h2>
                <p className="text-sm text-slate-500">
                  Subject: {currentClip.subject}, Scenario:{" "}
                  {currentClip.scenario}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="material-symbols-outlined text-base">
                    schedule
                  </span>
                  Duration:{" "}
                  <span className="text-primary tabular-nums">
                    {currentClip.duration}
                  </span>
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${(playbackTime / 105) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Audio Player Section */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6">
            <div className="w-full h-32 flex items-center justify-center gap-1">
              {/* Simulated Waveform */}
              {[
                12, 16, 24, 32, 20, 28, 36, 40, 24, 16, 20, 28, 24, 12, 16, 8,
                12, 16, 24, 20, 14, 10,
              ].map((height, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${i < Math.floor((playbackTime / 105) * 22) ? "bg-primary" : "bg-primary/40"}`}
                  style={{ width: "4px", height: `${height * 2}px` }}
                ></div>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <button className="size-12 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">
                  replay_10
                </span>
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="size-20 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-5xl">
                  {isPlaying ? "pause_circle" : "play_circle"}
                </span>
              </button>
              <button className="size-12 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">
                  forward_10
                </span>
              </button>
            </div>
            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>
                  {String(Math.floor(playbackTime / 60)).padStart(2, "0")}:
                  {String(playbackTime % 60).padStart(2, "0")}
                </span>
                <span>01:45</span>
              </div>
              <div className="relative h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
                <div className="absolute h-full w-[35%] bg-primary rounded-full"></div>
                <div className="absolute top-1/2 left-[35%] -translate-y-1/2 size-4 bg-primary border-2 border-white dark:border-slate-900 rounded-full shadow-md"></div>
              </div>
            </div>
          </div>

          {/* Emotion Selection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => setSelectedEmotion(emotion.id)}
                className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  selectedEmotion === emotion.id
                    ? `border-primary bg-primary/10 ring-2 ring-primary/30`
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary hover:bg-primary/5"
                }`}
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${getEmotionColor(emotion.id)}`}
                >
                  <span className="material-symbols-outlined">
                    {emotion.icon}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {emotion.label}
                </span>
              </button>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentClipIndex === 0}
              className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 font-semibold hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedEmotion || isSubmitting}
              className="flex items-center gap-2 px-10 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Submitting...
                </>
              ) : (
                <>
                  {isLastClip ? "View Results" : "Next Clip"}
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
