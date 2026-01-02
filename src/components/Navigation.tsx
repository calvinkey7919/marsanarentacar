import Link from 'next/link';

export type UserRole = 'ADMIN' | 'OPS' | 'CORPORATE' | null;

interface NavigationProps {
  role: UserRole;
}

// Returns a navigation menu based on the logged in user's role.  This component
// renders links to the various sections of the application.  Feel free to
// customise the styling using Tailwind classes or your own CSS.

export default function Navigation({ role }: NavigationProps) {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <span className="font-bold">Marsana</span>
        <div className="flex space-x-4 text-sm">
          {/* Shared links */}
          {role && (
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          )}
          {!role && (
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          )}
          {role === 'ADMIN' && (
            <>
              <Link href="/admin/branches" className="hover:underline">
                Branches
              </Link>
              <Link href="/admin/corporates" className="hover:underline">
                Corporates
              </Link>
              <Link href="/admin/users" className="hover:underline">
                Users
              </Link>
            </>
          )}
          {role === 'OPS' && (
            <>
              <Link href="/ops/fleet" className="hover:underline">
                Fleet
              </Link>
              <Link href="/ops/requests" className="hover:underline">
                Requests
              </Link>
            </>
          )}
          {role === 'CORPORATE' && (
            <>
              <Link href="/corporate/home" className="hover:underline">
                My Contracts
              </Link>
              <Link href="/corporate/vehicles" className="hover:underline">
                My Vehicles
              </Link>
              <Link href="/corporate/requests" className="hover:underline">
                My Requests
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}