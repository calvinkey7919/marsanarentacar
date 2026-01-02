'use client';

import { useAuth } from './AuthProvider';
import Navigation from './Navigation';

interface Props {
  children: React.ReactNode;
}

/**
 * LayoutContents renders the navigation and page content based on the current user's role.
 * It shows a loading screen while authentication is being resolved.
 */
export default function LayoutContents({ children }: Props) {
  const { role, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation role={role} />
      <main className="flex-1 container mx-auto p-4">{children}</main>
    </div>
  );
}
