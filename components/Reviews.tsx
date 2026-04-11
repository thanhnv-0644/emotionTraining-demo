"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsProps {
  courseId: string;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          disabled={!onChange}
        >
          <span className={`material-symbols-outlined text-xl ${star <= (hovered || value) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}>
            star
          </span>
        </button>
      ))}
    </div>
  );
}

export default function Reviews({ courseId }: ReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<ReviewItem[]>(`/api/courses/${courseId}/reviews`),
      api.get<{ id: string }>('/api/users/me'),
    ]).then(([data, me]) => {
      setReviews(data ?? []);
      setCurrentUserId(me?.id ?? null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [courseId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await api.post(`/api/courses/${courseId}/reviews`, { rating, comment: comment.trim() });
      const data = await api.get<ReviewItem[]>(`/api/courses/${courseId}/reviews`);
      setReviews(data ?? []);
      setComment("");
      setRating(5);
      setShowForm(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Gửi nhận xét thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(reviewId: string) {
    setDeletingId(reviewId);
    try {
      await api.delete(`/api/courses/${courseId}/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  const hasReviewed = reviews.some(r => r.userId === currentUserId);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold mb-3">Đánh giá khoá học</h3>
            {reviews.length > 0 ? (
              <div className="flex items-start gap-6">
                {/* Big score */}
                <div className="text-center">
                  <div className="text-5xl font-black text-slate-900 dark:text-slate-100 leading-none">{avgRating.toFixed(1)}</div>
                  <StarRating value={Math.round(avgRating)} />
                  <p className="text-xs text-slate-500 mt-1">{reviews.length} đánh giá</p>
                </div>
                {/* Bar chart */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  {ratingCounts.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-2 text-slate-500 shrink-0">{star}</span>
                      <span className="material-symbols-outlined text-sm text-amber-400 shrink-0">star</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="w-4 text-slate-500 text-right shrink-0">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Chưa có đánh giá nào.</p>
            )}
          </div>
          {!showForm && !hasReviewed && (
            <button
              onClick={() => setShowForm(true)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-sm">rate_review</span>
              Viết nhận xét
            </button>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-bold text-sm mb-4">Nhận xét của bạn</h4>
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Xếp hạng</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Nội dung</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về khoá học này..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              rows={4}
            />
          </div>
          {submitError && <p className="text-sm text-red-500 mb-3">{submitError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Đang gửi...' : 'Gửi nhận xét'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setComment(''); setRating(5); setSubmitError(''); }}
              className="px-5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Huỷ
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">chat_bubble_outline</span>
            <p className="text-slate-500 text-sm">Hãy là người đầu tiên đánh giá khoá học này!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reviews.map(review => (
              <div key={review.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm uppercase">
                      {review.userName?.[0] ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{review.userName}</p>
                        <StarRating value={review.rating} />
                        <span className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                  {review.userId === currentUserId && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="shrink-0 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Xoá nhận xét"
                    >
                      <span className="material-symbols-outlined text-base">
                        {deletingId === review.id ? 'hourglass_empty' : 'delete'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
