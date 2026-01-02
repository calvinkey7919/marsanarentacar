'use client';

import { useAuth } from '../../components/AuthProvider';

export default function DashboardPage() {
  const { role } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {role === 'ADMIN' && (
        <div>
          <p className="mb-4">
            Welcome, Admin! Use the navigation to manage branches, corporates
            and users.
          </p>
        </div>
      )}
      {role === 'OPS' && (
        <div>
          <p className="mb-4">
            Welcome, Operations! Use the navigation to view the fleet and
            process requests.
          </p>
        </div>
      )}
      {role === 'CORPORATE' && (
        <div>
          <p className="mb-4">
            Welcome, valued corporate user! Use the navigation to view your
            contracts, vehicles and requests.
          </p>
        </div>
      )}
      {!role && <p>Please log in.</p>}
    </div>
  );
}
