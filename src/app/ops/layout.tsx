"use client";

import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const { role, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (role !== 'OPS' && role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [role, loading, router]);
  if (loading || (role !== 'OPS' && role !== 'ADMIN')) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}