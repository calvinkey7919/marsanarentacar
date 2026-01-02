'use client';

import { useAuth } from './AuthProvider';
import Navigation from './Navigation';

interface Props {
  children: React.ReactNode;
}

/**
 * UI-only: modern container + spacing; logic unchanged.
 */
export default function LayoutContents({ children }: Props) {
  const { role, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--text-secondary)]">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation role={role} />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
        {children}
      </main>
      <footer className="border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4">© Marsana</div>
      </footer>
    </div>
  );
}
