import { useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import AppPageHeader from '@/components/AppPageHeader';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 10;

interface PaymentResponse {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  transactionId: string | null;
  failureReason: string | null;
  paidAt: string | null;
  expiredAt: string | null;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  completed: { label: 'Thành công', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  pending:   { label: 'Chờ xử lý', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  failed:    { label: 'Thất bại',  cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  cancelled: { label: 'Đã huỷ',   cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  expired:   { label: 'Hết hạn',  cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  refunded:  { label: 'Hoàn tiền', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

const ALL_STATUSES = ['', 'completed', 'pending', 'failed', 'cancelled', 'expired', 'refunded'];

function fmt(date: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const url = statusFilter ? `/api/admin/payments?status=${statusFilter}` : '/api/admin/payments';
    api.get<PaymentResponse[]>(url)
      .then(data => setPayments(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filtered = payments.filter(p =>
    p.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
    p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((s, p) => s + (p.amount ?? 0), 0);

  const countByStatus = (s: string) => payments.filter(p => p.status === s).length;

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Quản lý thanh toán</h1>
      </AppPageHeader>

      <div className="app-content space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Tổng doanh thu', value: totalRevenue.toLocaleString('vi-VN') + 'đ', icon: 'payments', color: 'text-emerald-600' },
            { label: 'Thành công', value: countByStatus('completed'), icon: 'check_circle', color: 'text-emerald-600' },
            { label: 'Chờ xử lý', value: countByStatus('pending'), icon: 'pending', color: 'text-amber-600' },
            { label: 'Thất bại / Huỷ', value: countByStatus('failed') + countByStatus('cancelled'), icon: 'cancel', color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-3 mb-1">
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm mã GD, khoá học..."
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary"
          >
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{s ? (STATUS_CONFIG[s]?.label ?? s) : 'Tất cả trạng thái'}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Mã GD</th>
                  <th className="px-6 py-4">Khoá học</th>
                  <th className="px-6 py-4">Phương thức</th>
                  <th className="px-6 py-4">Số tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i}><td colSpan={6} className="px-6 py-4">
                      <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    </td></tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">payments</span>
                    Không có giao dịch nào.
                  </td></tr>
                ) : paginated.map(p => {
                  const sc = STATUS_CONFIG[p.status] ?? { label: p.status, cls: 'bg-slate-100 text-slate-600' };
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-slate-500">{p.transactionId ?? p.id.slice(0, 12) + '...'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{p.courseTitle}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="uppercase text-xs font-bold text-slate-500">{p.method ?? '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${p.status === 'completed' ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                          {(p.amount ?? 0).toLocaleString('vi-VN')}đ
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${sc.cls}`}>{sc.label}</span>
                        {p.failureReason && (
                          <div className="text-xs text-red-500 mt-1">{p.failureReason}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        <div>{fmt(p.paidAt ?? p.createdAt)}</div>
                        {p.expiredAt && p.status === 'pending' && (
                          <div className="text-amber-500">Hết hạn: {fmt(p.expiredAt)}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      </div>
    </>
  );
}

AdminPayments.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
