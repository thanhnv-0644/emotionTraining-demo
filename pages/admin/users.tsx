import { useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import AppPageHeader from '@/components/AppPageHeader';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 10;

interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  xp: number;
  status: string;
}

interface UserForm {
  name: string;
  role: string;
  status: string;
  xp: string;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [editUser, setEditUser] = useState<UserResponse | null>(null);
  const [form, setForm] = useState<UserForm>({ name: '', role: 'student', status: 'active', xp: '0' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    api.get<UserResponse[]>('/api/admin/users')
      .then(data => setUsers(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openEdit = (user: UserResponse) => {
    setEditUser(user);
    setForm({ name: user.name, role: user.role, status: user.status, xp: String(user.xp ?? 0) });
    setFormError('');
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    setSaving(true); setFormError('');
    try {
      const updated = await api.put<UserResponse>(`/api/admin/users/${editUser.id}`, {
        name: form.name,
        role: form.role,
        status: form.status,
        xp: parseInt(form.xp) || 0,
      });
      setUsers(prev => prev.map(u => u.id === editUser.id ? updated : u));
      setEditUser(null);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Cập nhật thất bại');
    } finally { setSaving(false); }
  };

  const handleDelete = async (user: UserResponse) => {
    if (!confirm(`Xoá tài khoản "${user.name}"? Thao tác này sẽ vô hiệu hoá tài khoản.`)) return;
    try {
      await api.delete(`/api/admin/users/${user.id}`);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch {
      alert('Xóa thất bại.');
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none";

  return (
    <>
      <AppPageHeader>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Quản lý người dùng</h1>
      </AppPageHeader>

      <div className="app-content">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm theo tên hoặc email..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">XP</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      {search ? 'Không tìm thấy người dùng.' : 'Chưa có người dùng nào.'}
                    </td>
                  </tr>
                ) : (
                  paginated.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-slate-500 text-sm">person</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {user.role === 'admin' ? 'Quản trị' : 'Học viên'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {user.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">{(user.xp ?? 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(user)}
                            className="w-8 h-8 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                            title="Sửa"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="w-8 h-8 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                            title="Xóa"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex-shrink-0">
            <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>
        </div>
      </div>

      {editUser && (
        <Modal title={`Sửa tài khoản — ${editUser.name}`} onClose={() => setEditUser(null)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ tên</label>
              <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vai trò</label>
                <select className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="student">Học viên</option>
                  <option value="admin">Quản trị</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trạng thái</label>
                <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Vô hiệu</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Điểm XP</label>
              <input className={inputCls} type="number" min="0" value={form.xp} onChange={e => setForm(f => ({ ...f, xp: e.target.value }))} />
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Huỷ
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

AdminUsers.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
