'use client';

import Link from 'next/link';
import { useState } from 'react';

export type UserRole = 'ADMIN' | 'OPS' | 'CORPORATE' | null;

interface NavigationProps {
  role: UserRole;
}

/**
 * Responsive, accessible navbar with mobile toggle.
 * Role-based links unchanged; styling only.
 */
export default function Navigation({ role }: NavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-[var(--bg-surface)] md:bg-transparent border-b border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent-contrast)] text-[var(--accent)] font-bold">M</span>
            <span className="font-semibold tracking-tight">Marsana</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {role && (
              <Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">
                Dashboard
              </Link>
            )}
            {!role && (
              <Link href="/login" className="hover:text-[var(--accent)] transition-colors">
                Login
              </Link>
            )}
            {role === 'ADMIN' && (
              <>
                <Link href="/admin/branches" className="hover:text-[var(--accent)] transition-colors">Branches</Link>
                <Link href="/admin/corporates" className="hover:text-[var(--accent)] transition-colors">Corporates</Link>
                <Link href="/admin/users" className="hover:text-[var(--accent)] transition-colors">Users</Link>
              </>
            )}
            {role === 'OPS' && (
              <>
                <Link href="/ops/fleet" className="hover:text-[var(--accent)] transition-colors">Fleet</Link>
                <Link href="/ops/requests" className="hover:text-[var(--accent)] transition-colors">Requests</Link>
              </>
            )}
            {role === 'CORPORATE' && (
              <>
                <Link href="/corporate/home" className="hover:text-[var(--accent)] transition-colors">My Contracts</Link>
                <Link href="/corporate/vehicles" className="hover:text-[var(--accent)] transition-colors">My Vehicles</Link>
                <Link href="/corporate/requests" className="hover:text-[var(--accent)] transition-colors">My Requests</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-sm"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[var(--text-primary)]">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2 text-sm">
            {role && (
              <Link href="/dashboard" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            )}
            {!role && (
              <Link href="/login" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>
                Login
              </Link>
            )}
            {role === 'ADMIN' && (
              <>
                <Link href="/admin/branches" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>Branches</Link>
                <Link href="/admin/corporates" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>Corporates</Link>
                <Link href="/admin/users" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>Users</Link>
              </>
            )}
            {role === 'OPS' && (
              <>
                <Link href="/ops/fleet" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>Fleet</Link>
                <Link href="/ops/requests" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>Requests</Link>
              </>
            )}
            {role === 'CORPORATE' && (
              <>
                <Link href="/corporate/home" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>My Contracts</Link>
                <Link href="/corporate/vehicles" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>My Vehicles</Link>
                <Link href="/corporate/requests" className="block rounded-md px-2 py-2 hover:bg-[var(--bg-muted)]" onClick={() => setOpen(false)}>My Requests</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
