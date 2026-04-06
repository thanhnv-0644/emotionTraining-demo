interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build page number list with ellipsis
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const btn = (label: React.ReactNode, target: number, disabled: boolean, active = false) => (
    <button
      key={String(label)}
      onClick={() => !disabled && onChange(target)}
      disabled={disabled}
      className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-semibold transition-colors ${
        active
          ? 'bg-primary text-white shadow-sm'
          : disabled
          ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <span className="text-sm text-slate-500">
        {from}–{to} / <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span>
      </span>
      <div className="flex items-center gap-1">
        {btn(
          <span className="material-symbols-outlined text-base leading-none">chevron_left</span>,
          page - 1,
          page === 1
        )}
        {pages.map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} className="px-1 text-slate-400 text-sm select-none">…</span>
            : btn(p, p, false, p === page)
        )}
        {btn(
          <span className="material-symbols-outlined text-base leading-none">chevron_right</span>,
          page + 1,
          page === totalPages
        )}
      </div>
    </div>
  );
}
