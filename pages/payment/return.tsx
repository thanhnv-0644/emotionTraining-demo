import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api } from '@/lib/api';

interface PaymentResponse {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  status: string;
  paidAt: string | null;
  failureReason: string | null;
}

type ResultState = 'loading' | 'success' | 'cancelled' | 'failed';

export default function PaymentReturn() {
  const router = useRouter();
  const [state, setState] = useState<ResultState>('loading');
  const [payment, setPayment] = useState<PaymentResponse | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const params = router.query as Record<string, string>;
    if (!params.vnp_TxnRef) {
      setState('failed');
      return;
    }

    // Gửi toàn bộ query params lên backend để verify & update status
    const qs = new URLSearchParams(params).toString();
    api.get<PaymentResponse>(`/api/payments/return/vnpay?${qs}`)
      .then(data => {
        setPayment(data);
        if (data.status === 'completed') setState('success');
        else if (data.status === 'cancelled') setState('cancelled');
        else setState('failed');
      })
      .catch(() => setState('failed'));
  }, [router.isReady]);

  const STATUS_CONFIG = {
    loading: {
      icon: null,
      title: 'Đang xử lý...',
      desc: 'Vui lòng chờ trong giây lát.',
      color: '',
    },
    success: {
      icon: 'check_circle',
      title: 'Thanh toán thành công!',
      desc: `Bạn đã đăng ký khoá học thành công. Chúc bạn học tốt!`,
      color: 'text-green-500',
    },
    cancelled: {
      icon: 'cancel',
      title: 'Đã huỷ thanh toán',
      desc: 'Bạn đã huỷ giao dịch. Khoá học chưa được kích hoạt.',
      color: 'text-slate-400',
    },
    failed: {
      icon: 'error',
      title: 'Thanh toán thất bại',
      desc: 'Giao dịch không thành công. Vui lòng thử lại.',
      color: 'text-red-500',
    },
  };

  const cfg = STATUS_CONFIG[state];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">

        {/* Header */}
        <div className={`p-8 flex flex-col items-center text-center ${
          state === 'success'
            ? 'bg-gradient-to-b from-green-50 to-white dark:from-green-500/10 dark:to-slate-900'
            : state === 'cancelled'
            ? 'bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900'
            : state === 'failed'
            ? 'bg-gradient-to-b from-red-50 to-white dark:from-red-500/10 dark:to-slate-900'
            : 'bg-slate-50 dark:bg-slate-800'
        }`}>
          {state === 'loading' ? (
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          ) : (
            <span className={`material-symbols-outlined text-6xl mb-4 ${cfg.color}`}>
              {cfg.icon}
            </span>
          )}
          <h1 className="text-xl font-black text-slate-900 dark:text-white mb-2">{cfg.title}</h1>
          <p className="text-slate-500 text-sm leading-relaxed">{cfg.desc}</p>
        </div>

        {/* Payment details */}
        {payment && state !== 'loading' && (
          <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Khoá học</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[60%]">{payment.courseTitle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Số tiền</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {payment.amount.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Mã giao dịch</span>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{payment.id}</span>
            </div>
            {payment.paidAt && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Thời gian</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {new Date(payment.paidAt).toLocaleString('vi-VN')}
                </span>
              </div>
            )}
            {payment.failureReason && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Lý do</span>
                <span className="text-red-500 text-xs text-right max-w-[60%]">{payment.failureReason}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {state !== 'loading' && (
          <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
            {state === 'success' && payment && (
              <Link
                href={`/user/courses/${payment.courseId}`}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm text-center shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
              >
                Vào khoá học ngay
              </Link>
            )}
            <Link
              href="/user/courses"
              className={`w-full py-3 rounded-xl font-bold text-sm text-center transition-colors ${
                state === 'success'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90'
              }`}
            >
              {state === 'success' ? 'Xem tất cả khoá học' : 'Quay lại khoá học'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
