import './globals.css';
import { AuthProvider } from '../components/AuthProvider';
import LayoutContents from '../components/LayoutContents';

export const metadata = {
  title: 'Marsana Ops Portal',
  description: 'Fleet operations and corporate portal',
};

/**
 * Root layout wraps the app in the AuthProvider and passes content to LayoutContents,
 * which is a client component. This allows us to use hooks inside LayoutContents
 * without turning the whole layout into a client component.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <AuthProvider>
          <LayoutContents>{children}</LayoutContents>
        </AuthProvider>
      </body>
    </html>
  );
}
