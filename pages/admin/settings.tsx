import { ReactNode } from 'react';
import AdminSystemSettings from '@/components/AdminSystemSettings';
import AdminLayout from '@/components/AdminLayout';

export default function AdminSettingsPage() {
  return <AdminSystemSettings />;
}

AdminSettingsPage.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
