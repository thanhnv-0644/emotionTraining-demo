"use client";

import Link from "next/link";

const EMOTION_VI: Record<string, string> = {
  happiness: "Hạnh phúc",
  sadness: "Buồn bã",
  anger: "Tức giận",
  surprise: "Ngạc nhiên",
  fear: "Sợ hãi",
  disgust: "Ghê tởm",
  neutral: "Bình thản",
};

function emotionLabel(id: string) {
  return EMOTION_VI[id] ?? id;
}

interface AnswerItem {
  question: string;
  selected: string;
  correct: string;
  status: "correct" | "incorrect";
}

interface LessonResultProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  xpEarned?: number;
  answers?: AnswerItem[];
}

export default function LessonResult({
  courseId = '',
  lessonId = '',
  lessonTitle,
  score = 0,
  totalQuestions = 0,
  correctAnswers = 0,
  xpEarned = 0,
  answers = [],
}: LessonResultProps) {

  const incorrectAnswers = totalQuestions - correctAnswers;

  // Compute per-emotion accuracy from actual answers
  const emotionStats: Record<string, { correct: number; total: number }> = {};
  for (const item of answers) {
    const key = item.correct;
    if (!emotionStats[key]) emotionStats[key] = { correct: 0, total: 0 };
    emotionStats[key].total++;
    if (item.status === 'correct') emotionStats[key].correct++;
  }
  const emotionEntries = Object.entries(emotionStats).sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total);

  const headerMessage = score >= 80 ? 'Làm tốt lắm!' : score >= 60 ? 'Cố gắng thêm nhé!' : 'Hãy thử lại!';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 lg:p-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-6">
          <div className={`size-24 rounded-full flex items-center justify-center text-white shadow-2xl ${score >= 80 ? 'bg-gradient-to-br from-green-400 to-green-600' : score >= 60 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>
            <span className="material-symbols-outlined text-6xl">
              {score >= 80 ? 'check_circle' : score >= 60 ? 'sentiment_neutral' : 'replay'}
            </span>
          </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
          {headerMessage}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Bạn đã hoàn thành{" "}
          <span className="font-bold text-primary">{lessonTitle}</span>.
        </p>
      </div>

      {/* Results Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        {/* Score Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary p-12 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
          <div className="relative z-10 text-center">
            <div className="text-7xl font-extrabold mb-2">{score}%</div>
            <p className="text-xl text-white/80">Điểm số</p>
          </div>
        </div>

        {/* XP Banner */}
        {xpEarned > 0 && (
          <div className="flex items-center justify-center gap-3 px-8 py-4 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/30">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center shadow-md shadow-amber-400/30">
              <span className="material-symbols-outlined text-white text-[20px]">bolt</span>
            </div>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
              Bạn vừa nhận được <span className="text-xl text-amber-500">+{xpEarned}</span> XP!
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 p-8 border-b border-slate-200 dark:border-slate-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">{correctAnswers}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Trả lời đúng</p>
          </div>
          <div className="text-center border-l border-r border-slate-200 dark:border-slate-800">
            <div className="text-3xl font-bold text-red-500 mb-2">{incorrectAnswers}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Trả lời sai</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{totalQuestions}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tổng câu hỏi</p>
          </div>
        </div>

        {/* Per-emotion breakdown */}
        {emotionEntries.length > 0 && (
          <div className="p-8 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5">
              Kết quả theo cảm xúc
            </h3>
            <div className="space-y-4">
              {emotionEntries.map(([emotion, stat]) => {
                const pct = Math.round((stat.correct / stat.total) * 100);
                const barColor = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500';
                return (
                  <div key={emotion}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {emotionLabel(emotion)}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {pct}%
                        <span className="text-xs text-slate-500 ml-1">({stat.correct}/{stat.total})</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`${barColor} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Answers */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5">
            Chi tiết câu trả lời
          </h3>
          <div className="space-y-3">
            {answers.length === 0 ? (
              <p className="text-slate-500 text-sm">Không có dữ liệu câu trả lời.</p>
            ) : (
              answers.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    item.status === "correct"
                      ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30"
                      : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-8 rounded-full flex items-center justify-center text-white shrink-0 ${item.status === "correct" ? "bg-green-500" : "bg-red-500"}`}>
                      <span className="material-symbols-outlined text-sm">
                        {item.status === "correct" ? "check" : "close"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.question}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Bạn chọn: <span className="font-bold">{emotionLabel(item.selected)}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                    item.status === "correct"
                      ? "bg-green-200 dark:bg-green-500/30 text-green-700 dark:text-green-400"
                      : "bg-red-200 dark:bg-red-500/30 text-red-700 dark:text-red-400"
                  }`}>
                    {item.status === "correct" ? "Đúng" : `Đáp án: ${emotionLabel(item.correct)}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
        <Link
          href={`/user/courses/${courseId}/lessons/${lessonId}`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined">replay</span>
          Làm lại bài
        </Link>
        <Link
          href={`/user/courses/${courseId}/lessons`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          Danh sách bài học
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
