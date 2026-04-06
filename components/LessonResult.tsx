"use client";

import Link from "next/link";
import { useRouter } from "next/router";

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

interface LessonResultProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  timeSpent?: string;
  answers?: Array<{
    question: string;
    selected: string;
    correct: string;
    status: "correct" | "incorrect";
  }>;
}

export default function LessonResult({
  courseId = '',
  lessonTitle,
  score = 85,
  totalQuestions = 5,
  correctAnswers = 4,
  timeSpent = "12m 45s",
  answers = [],
}: LessonResultProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 lg:p-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="size-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-2xl">
            <span className="material-symbols-outlined text-6xl">
              check_circle
            </span>
          </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
          Làm tốt lắm!
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Bạn đã hoàn thành{" "}
          <span className="font-bold text-primary">{lessonTitle}</span>. Đây là kết quả của bạn.
        </p>
      </div>

      {/* Results Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        {/* Score Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary p-12 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          <div className="relative z-10 text-center">
            <div className="text-7xl font-extrabold mb-2">{score}%</div>
            <p className="text-xl text-white/80">Điểm số</p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-3 gap-4 p-8 border-b border-slate-200 dark:border-slate-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {correctAnswers}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Trả lời đúng
            </p>
          </div>
          <div className="text-center border-l border-r border-slate-200 dark:border-slate-800">
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {totalQuestions}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tổng câu hỏi
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {timeSpent}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Thời gian
            </p>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">
            Phân tích nhanh
          </h3>
          <div className="space-y-4">
            {/* Accuracy */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Độ chính xác
                </span>
                <span className="text-sm font-bold text-primary">{score}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>

            {/* Response Speed */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tốc độ phản hồi
                </span>
                <span className="text-sm font-bold text-green-600">
                  Tốt
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>

            {/* Consistency */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Ổn định
                </span>
                <span className="text-sm font-bold text-blue-600">Khá</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Answers */}
        <div className="px-8 pb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">
            Chi tiết câu trả lời
          </h3>
          <div className="space-y-3">
            {answers.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Không có dữ liệu câu trả lời
              </p>
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
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-white ${
                        item.status === "correct"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {item.status === "correct" ? "check" : "close"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.question}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Bạn chọn:{" "}
                        <span className="font-bold">{emotionLabel(item.selected)}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.status === "correct"
                        ? "bg-green-200 dark:bg-green-500/30 text-green-700 dark:text-green-400"
                        : "bg-red-200 dark:bg-red-500/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {item.status === "correct"
                      ? "Đúng"
                      : `Đáp án: ${emotionLabel(item.correct)}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
        <button
          onClick={() => router.back()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined">repeat</span>
          Làm lại bài
        </button>
        <Link
          href={`/user/courses/${courseId}`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          Về khoá học
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      {/* Tips Section */}
      <div className="w-full max-w-2xl mt-12 p-8 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">lightbulb</span>
          Gợi ý cải thiện
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li className="flex items-start gap-3">
            <span className="material-symbols-outlined text-base mt-0.5">
              check_small
            </span>
            <span>
              Nghe kỹ sự thay đổi cao độ và ngữ điệu trong giọng nói
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="material-symbols-outlined text-base mt-0.5">
              check_small
            </span>
            <span>Chú ý các khoảng dừng, do dự khi nói</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="material-symbols-outlined text-base mt-0.5">
              check_small
            </span>
            <span>
              Luyện tập nhận diện biểu cảc trong ngữ cảnh cụ thể
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
