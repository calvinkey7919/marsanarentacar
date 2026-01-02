import Link from 'next/link';

export default function Home() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center py-20 sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-1 text-xs text-[var(--text-secondary)] mb-4">
            Marsana Ops + Corporate Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Manage fleet operations with speed and clarity
          </h1>
          <p className="max-w-2xl text-[var(--text-secondary)] mb-8">
            Login to access your role-based dashboard for branches, vehicles, requests, and corporate contracts.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] text-white px-5 py-2.5 text-sm font-medium shadow hover:brightness-110 transition"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium hover:border-[var(--accent)] transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
