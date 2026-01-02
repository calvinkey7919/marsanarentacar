import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-3xl font-bold mb-4">Welcome to Marsana Ops Portal</h1>
      <p className="mb-6 text-center max-w-md">
        This portal powers Marsana’s fleet operations and corporate customer portal.
        Please log in to access your dashboard.
      </p>
      <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Login
      </Link>
    </div>
  );
}