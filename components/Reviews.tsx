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
  updatedAt: string;
}

interface ReviewsProps {
  courseId: string;
}

export default function Reviews({ courseId }: ReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await api.get<ReviewItem[]>(
          `/api/courses/${courseId}/reviews`,
        );
        setReviews(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      await api.post(`/api/courses/${courseId}/reviews`, { rating, comment });
      setComment("");
      setRating(5);
      setShowForm(false);
      // Refresh reviews
      const data = await api.get<ReviewItem[]>(
        `/api/courses/${courseId}/reviews`,
      );
      setReviews(data || []);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá review này?")) return;

    try {
      await api.delete(`/api/courses/${courseId}/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Reviews
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`material-symbols-outlined text-sm ${i < Math.round(Number(avgRating)) ? "text-amber-500 fill-current" : "text-slate-300"}`}
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {avgRating} ({reviews.length} reviews)
            </span>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-colors"
                >
                  <span
                    className={`material-symbols-outlined text-2xl ${star <= rating ? "text-amber-500 fill-current" : "text-slate-300"}`}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this course..."
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-primary resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-3 border-slate-200 dark:border-slate-700 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-center py-8 text-slate-500">
          Chưa có review nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={review.userAvatar || "https://via.placeholder.com/40"}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {review.userName}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-sm ${i < review.rating ? "text-amber-500 fill-current" : "text-slate-300"}`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
                </button>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                {review.comment}
              </p>
              <p className="text-xs text-slate-500">
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
