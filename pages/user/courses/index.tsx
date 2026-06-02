import Link from 'next/link';
import { useEffect, useState, ReactNode, useMemo } from 'react';
import { api, BASE_URL } from '@/lib/api';
import UserLayout from '@/components/UserLayout';
import AppPageHeader from '@/components/AppPageHeader';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 9;

const LEVEL_CONFIG: Record<string, { label: string; cls: string }> = {
  easy:     { label: 'Dễ',         cls: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' },
  medium:   { label: 'Trung bình', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' },
  advanced: { label: 'Nâng cao',   cls: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
};

interface Course {
  id: string; title: string; description: string; image: string | null;
  category: string; lessonCount: number; isFree: boolean; price: number; status: string;
}
interface WishlistItem {
  courseId: string; title: string; description: string; image: string | null;
  price: number; isFree: boolean; category: string; addedAt: string;
}
interface Rating { avg: number; count: number; }

type SortKey = 'default' | 'rating_desc' | 'price_asc' | 'price_desc';
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default',     label: 'Mặc định' },
  { value: 'rating_desc', label: 'Đánh giá cao nhất' },
  { value: 'price_asc',   label: 'Giá tăng dần' },
  { value: 'price_desc',  label: 'Giá giảm dần' },
];

function FilterBar({
  search, onSearch,
  level, onLevel,
  price, onPrice,
  sort, onSort,
  placeholder,
  hidePrice,
}: {
  search: string; onSearch: (v: string) => void;
  level: string; onLevel: (v: string) => void;
  price: string; onPrice: (v: string) => void;
  sort: SortKey; onSort: (v: SortKey) => void;
  placeholder?: string;
  hidePrice?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">search</span>
        <input
          type="text" value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={placeholder ?? 'Tìm kiếm...'}
          className="w-full pl-9 pr-9 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        {search && (
          <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Level */}
      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 shrink-0">
        <span className="material-symbols-outlined text-[15px] text-slate-400 mr-0.5">signal_cellular_alt</span>
        {['all', 'easy', 'medium', 'advanced'].map(v => (
          <button key={v} onClick={() => onLevel(v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${level === v ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            {v === 'all' ? 'Tất cả' : LEVEL_CONFIG[v]?.label}
          </button>
        ))}
      </div>

      {/* Price */}
      {!hidePrice && (
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 shrink-0">
          <span className="material-symbols-outlined text-[15px] text-slate-400 mr-0.5">payments</span>
          {[['all','Tất cả'],['free','Miễn phí'],['paid','Có phí']].map(([v,l]) => (
            <button key={v} onClick={() => onPrice(v)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${price === v ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Sort */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shrink-0">
        <span className="material-symbols-outlined text-[15px] text-slate-400">sort</span>
        <select value={sort} onChange={e => onSort(e.target.value as SortKey)}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-transparent focus:outline-none cursor-pointer">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

function applySortAndFilter<T extends { title: string; description: string; price: number; isFree: boolean; category: string }>(
  items: T[],
  search: string,
  level: string,
  price: string,
  sort: SortKey,
  ratings: Record<string, Rating>,
  getId: (item: T) => string,
): T[] {
  const q = search.trim().toLowerCase();
  let result = items.filter(item => {
    if (q && !`${item.title} ${item.description ?? ''}`.toLowerCase().includes(q)) return false;
    if (level !== 'all' && item.category !== level) return false;
    if (price === 'free' && !(item.isFree || !item.price)) return false;
    if (price === 'paid' && (item.isFree || !item.price)) return false;
    return true;
  });
  if (sort === 'rating_desc') result = [...result].sort((a, b) => (ratings[getId(b)]?.avg ?? 0) - (ratings[getId(a)]?.avg ?? 0));
  if (sort === 'price_asc')   result = [...result].sort((a, b) => (a.isFree ? 0 : a.price) - (b.isFree ? 0 : b.price));
  if (sort === 'price_desc')  result = [...result].sort((a, b) => (b.isFree ? 0 : b.price) - (a.isFree ? 0 : a.price));
  return result;
}

function CourseCard({ id, title, description, image, category, lessonCount, price, isFree, rating, starred, toggling, onToggle, href }: {
  id: string; title: string; description: string; image: string | null; category: string;
  lessonCount?: number; price: number; isFree: boolean;
  rating?: Rating; starred: boolean; toggling: boolean;
  onToggle: () => void; href: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      <div className="h-44 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {image ? (
          <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url('${BASE_URL}${image}')` }} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-indigo-400/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary/40">psychology</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Price badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold ${(isFree || !price) ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
          {(isFree || !price) ? 'Miễn phí' : `${price.toLocaleString('vi-VN')}đ`}
        </div>
        {/* Level badge */}
        <div className={`absolute bottom-3 left-3 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold ${LEVEL_CONFIG[category]?.cls ?? 'bg-white/90 text-slate-700'}`}>
          {LEVEL_CONFIG[category]?.label ?? category}
        </div>
        {/* Star toggle */}
        <button onClick={onToggle} disabled={toggling}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors disabled:opacity-60 z-10"
          title={starred ? 'Xoá khỏi yêu thích' : 'Thêm vào yêu thích'}>
          <span className={`material-symbols-outlined text-[22px] transition-all ${starred ? 'text-amber-400' : 'text-white/80'}`}
            style={{ fontVariationSettings: starred ? "'FILL' 1" : "'FILL' 0" }}>
            star
          </span>
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{description}</p>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          {lessonCount !== undefined && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">menu_book</span>{lessonCount} bài
            </span>
          )}
          {rating ? (
            <span className="flex items-center gap-1 font-semibold ml-auto">
              <span className="material-symbols-outlined text-[14px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-slate-700 dark:text-slate-300">{rating.avg.toFixed(1)}</span>
              <span className="text-slate-400">({rating.count})</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-300 ml-auto">
              <span className="material-symbols-outlined text-[14px]">star</span>Chưa có
            </span>
          )}
        </div>
        <Link href={href}
          className="w-full py-2 rounded-lg text-sm font-bold text-center bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors">
          Tiếp tục học
        </Link>
      </div>
    </div>
  );
}

function WishlistCard({ item, rating, toggling, onRemove }: {
  item: WishlistItem; rating?: Rating; toggling: boolean; onRemove: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      <div className="h-44 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {item.image ? (
          <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url('${BASE_URL}${item.image}')` }} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-indigo-400/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary/40">psychology</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold ${(item.isFree || !item.price) ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
          {(item.isFree || !item.price) ? 'Miễn phí' : `${item.price.toLocaleString('vi-VN')}đ`}
        </div>
        <div className={`absolute bottom-3 left-3 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold ${LEVEL_CONFIG[item.category]?.cls ?? 'bg-white/90 text-slate-700'}`}>
          {LEVEL_CONFIG[item.category]?.label ?? item.category}
        </div>
        <button onClick={onRemove} disabled={toggling}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors disabled:opacity-60 z-10"
          title="Xoá khỏi yêu thích">
          <span className="material-symbols-outlined text-[22px] text-amber-400"
            style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{item.description}</p>
        {rating && (
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-3">
            <span className="material-symbols-outlined text-[14px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-slate-700 dark:text-slate-300">{rating.avg.toFixed(1)}</span>
            <span className="text-slate-400">({rating.count})</span>
          </div>
        )}
        <Link href={`/user/courses/${item.courseId}`}
          className="w-full py-2 rounded-lg text-sm font-bold text-center bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors">
          Xem khoá học
        </Link>
      </div>
    </div>
  );
}

export default function MyCourses() {
  const [tab, setTab] = useState<'enrolled' | 'wishlist'>('enrolled');
  const [enrolled, setEnrolled] = useState<Course[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Shared filter/sort state
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([
      api.get<Course[]>('/api/courses/my'),
      api.get<WishlistItem[]>('/api/wishlists'),
    ]).then(([enrolledData, wishlistData]) => {
      const e = enrolledData ?? [];
      const w = wishlistData ?? [];
      setEnrolled(e);
      setWishlist(w);
      setWishlisted(new Set(w.map(i => i.courseId)));

      const ids = [...new Set([...e.map(c => c.id), ...w.map(i => i.courseId)])];
      Promise.all(ids.map(id =>
        api.get<{ rating: number }[]>(`/api/courses/${id}/reviews`)
          .then(r => ({ id, reviews: r ?? [] })).catch(() => ({ id, reviews: [] }))
      )).then(results => {
        const map: Record<string, Rating> = {};
        for (const { id, reviews } of results)
          if (reviews.length > 0)
            map[id] = { avg: Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10, count: reviews.length };
        setRatings(map);
      });
    }).finally(() => setLoading(false));
  }, []);

  async function toggleWishlist(courseId: string) {
    setTogglingId(courseId);
    const inWishlist = wishlisted.has(courseId);
    setWishlisted(prev => { const n = new Set(prev); inWishlist ? n.delete(courseId) : n.add(courseId); return n; });
    try {
      if (inWishlist) {
        await api.delete(`/api/wishlists/${courseId}`);
        setWishlist(prev => prev.filter(i => i.courseId !== courseId));
      } else {
        await api.post(`/api/wishlists/${courseId}`, {});
        const c = enrolled.find(x => x.id === courseId);
        if (c) setWishlist(prev => [...prev, { courseId: c.id, title: c.title, description: c.description, image: c.image, price: c.price, isFree: c.isFree, category: c.category, addedAt: new Date().toISOString() }]);
      }
    } catch {
      setWishlisted(prev => { const n = new Set(prev); inWishlist ? n.add(courseId) : n.delete(courseId); return n; });
    } finally {
      setTogglingId(null);
    }
  }

  async function removeWishlist(courseId: string) {
    setTogglingId(courseId);
    try {
      await api.delete(`/api/wishlists/${courseId}`);
      setWishlist(prev => prev.filter(i => i.courseId !== courseId));
      setWishlisted(prev => { const n = new Set(prev); n.delete(courseId); return n; });
    } finally {
      setTogglingId(null);
    }
  }

  const filteredEnrolled = useMemo(() =>
    applySortAndFilter(enrolled, search, level, 'all', sort, ratings, c => c.id),
  [enrolled, search, level, sort, ratings]);

  const filteredWishlist = useMemo(() =>
    applySortAndFilter(wishlist.map(i => ({ ...i, id: i.courseId })), search, level, 'all', sort, ratings, i => i.courseId),
  [wishlist, search, level, sort, ratings]);

  const enrolledPage = filteredEnrolled.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const wishlistPage = filteredWishlist.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Khoá học của tôi</h1>
      </AppPageHeader>

      <div className="app-content space-y-5">
        {/* Filter bar — trên tabs */}
        <FilterBar
          search={search} onSearch={v => { setSearch(v); setPage(1); }}
          level={level} onLevel={v => { setLevel(v); setPage(1); }}
          price="all" onPrice={() => {}}
          sort={sort} onSort={v => { setSort(v); setPage(1); }}
          placeholder="Tìm kiếm khoá học..." hidePrice
        />

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          {[
            { key: 'enrolled', label: `Đang học (${enrolled.length})`, icon: null },
            { key: 'wishlist', label: `Yêu thích (${wishlist.length})`, icon: 'star' },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as 'enrolled' | 'wishlist'); setPage(1); }}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold transition-colors ${tab === t.key ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}>
              {t.icon && <span className="material-symbols-outlined text-[15px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>{t.icon}</span>}
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border h-72 animate-pulse" />)}
          </div>
        ) : tab === 'enrolled' ? (
          enrolled.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">school</span>
              <p className="text-slate-500">Bạn chưa đăng ký khoá học nào.</p>
              <Link href="/user/explore" className="mt-3 inline-block text-primary font-semibold text-sm hover:underline">Khám phá khoá học</Link>
            </div>
          ) : filteredEnrolled.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">search_off</span>
              <p className="text-slate-500 text-sm">Không có khoá học phù hợp.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400">{filteredEnrolled.length} khoá học</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {enrolledPage.map(c => (
                  <CourseCard key={c.id} id={c.id} title={c.title} description={c.description}
                    image={c.image} category={c.category} lessonCount={c.lessonCount}
                    price={c.price} isFree={c.isFree} rating={ratings[c.id]}
                    starred={wishlisted.has(c.id)} toggling={togglingId === c.id}
                    onToggle={() => toggleWishlist(c.id)}
                    href={`/user/courses/${c.id}`} />
                ))}
              </div>
              <Pagination page={page} total={filteredEnrolled.length} pageSize={PAGE_SIZE} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </>
          )
        ) : (
          wishlist.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">star_border</span>
              <p className="text-slate-500">Chưa có khoá học yêu thích.</p>
              <p className="text-slate-400 text-sm mt-1">Ấn ⭐ trên khoá đang học để thêm.</p>
            </div>
          ) : filteredWishlist.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">search_off</span>
              <p className="text-slate-500 text-sm">Không có khoá học phù hợp.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400">{filteredWishlist.length} khoá học yêu thích</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {wishlistPage.map(item => (
                  <WishlistCard key={item.courseId} item={item} rating={ratings[item.courseId]}
                    toggling={togglingId === item.courseId} onRemove={() => removeWishlist(item.courseId)} />
                ))}
              </div>
              <Pagination page={page} total={filteredWishlist.length} pageSize={PAGE_SIZE} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </>
          )
        )}
      </div>
    </>
  );
}

MyCourses.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;
