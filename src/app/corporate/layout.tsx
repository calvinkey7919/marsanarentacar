"use client";

import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  const { role, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (role !== 'CORPORATE') {
        router.push('/dashboard');
      }
    }
  }, [role, loading, router]);
  if (loading || role !== 'CORPORATE') {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}