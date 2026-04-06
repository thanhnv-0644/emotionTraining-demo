import { ReactNode } from 'react';
import UserProfile from '@/components/UserProfile';
import UserLayout from '@/components/UserLayout';

export default function UserProfilePage() {
  return <UserProfile />;
}

UserProfilePage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;
