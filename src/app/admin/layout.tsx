"use client";

import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (role !== 'ADMIN') {
        // Redirect non‑admin users back to dashboard
        router.push('/dashboard');
      }
    }
  }, [role, loading, router]);

  if (loading || role !== 'ADMIN') {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}