import { ReactNode } from 'react';
import AdminAnalytics from "@/components/AdminAnalytics";
import AdminLayout from '@/components/AdminLayout';

export default function AdminAnalyticsPage() {
  return <AdminAnalytics />;
}

AdminAnalyticsPage.getLayout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
