import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import AppPageHeader from '@/components/AppPageHeader';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 10;

interface ReviewResponse {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseOption { id: string; title: string; }

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`material-symbols-outlined text-sm ${i <= rating ? 'text-amber-400' : 'text-slate-300'}`}
          style={{ fontVariationSettings: i <= rating ? "'FILL' 1" : "'FILL' 0" }}>
          star
        </span>
      ))}
      <span className="ml-1 text-xs font-bold text-slate-600 dark:text-slate-400">{rating}/5</span>
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get<CourseOption[]>('/api/admin/courses').then(data => setCourses(data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedCourseId ? `/api/admin/reviews?courseId=${selectedCourseId}` : '/api/admin/reviews';
    api.get<ReviewResponse[]>(url)
      .then(data => setReviews(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCourseId]);

  const filtered = reviews.filter(r => {
    const matchSearch = r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === 0 || r.rating === ratingFilter;
    return matchSearch && matchRating;
  });
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length).toFixed(1)
    : '0';

  const countByRating = (r: number) => reviews.filter(rev => rev.rating === r).length;

  const handleDelete = async (review: ReviewResponse) => {
    if (!confirm(`Xóa đánh giá của "${review.userName}"?`)) return;
    try {
      await api.delete(`/api/admin/reviews/${review.id}`);
      setReviews(prev => prev.filter(r => r.id !== review.id));
    } catch {
      alert('Xóa thất bại.');
    }
  };

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Quản lý đánh giá</h1>
      </AppPageHeader>

      <div className="app-content space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-amber-500 text-lg">star</span>
              <span className="text-xs font-medium text-slate-500">Điểm trung bình</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{avgRating}<span className="text-lg text-slate-400">/5</span></p>
            <p className="text-xs text-slate-500 mt-1">{reviews.length} đánh giá</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <p className="text-xs font-medium text-slate-500 mb-3">Phân bố sao</p>
            <div className="space-y-1.5">
              {[5,4,3,2,1].map(r => {
                const cnt = countByRating(r);
                const pct = reviews.length ? Math.round((cnt / reviews.length) * 100) : 0;
                return (
                  <div key={r} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-4">{r}</span>
                    <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-6">{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm theo tên, nội dung..."
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary w-64"
            />
          </div>
          <select
            value={selectedCourseId}
            onChange={e => { setSelectedCourseId(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary"
          >
            <option value="">Tất cả khoá học</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <select
            value={ratingFilter}
            onChange={e => { setRatingFilter(Number(e.target.value)); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary"
          >
            <option value={0}>Tất cả sao</option>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} sao</option>)}
          </select>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />)
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">rate_review</span>
              <p className="text-slate-500">Không có đánh giá nào.</p>
            </div>
          ) : paginated.map(review => (
            <div key={review.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4 group hover:shadow-sm transition-shadow">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-base">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{review.userName}</span>
                  <Stars rating={review.rating} />
                  <span className="text-xs text-slate-400 ml-auto">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                  </span>
                </div>
                <Link
                  href={`/admin/courses/${review.courseId}/lessons`}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-2"
                  title="Xem khoá học"
                >
                  <span className="material-symbols-outlined text-sm">school</span>
                  {review.courseTitle}
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{review.comment || <em className="text-slate-400">Không có nhận xét</em>}</p>
              </div>
              <button
                onClick={() => handleDelete(review)}
                className="w-8 h-8 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                title="Xóa đánh giá"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      </div>
    </>
  );
}

AdminReviews.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
