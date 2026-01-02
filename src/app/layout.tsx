import './globals.css';
import { AuthProvider } from '../components/AuthProvider';
import LayoutContents from '../components/LayoutContents';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Marsana Ops Portal',
  description: 'Fleet operations and corporate portal',
};

// Ensure runtime rendering so Supabase env is read at request time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const inter = Inter({ subsets: ['latin'] });

/**
 * UI-only: Inter font + theme tokens on body.
 * No changes to auth or routing logic.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased bg-[var(--bg-app)] text-[var(--text-primary)]`}>
        <AuthProvider>
          <LayoutContents>{children}</LayoutContents>
        </AuthProvider>
      </body>
    </html>
  );
}
