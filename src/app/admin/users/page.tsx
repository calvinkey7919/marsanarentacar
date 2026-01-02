"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../components/AuthProvider';

interface UserRow {
  id: string;
  email: string;
  role: string;
  corporate_id: string | null;
  is_active: boolean;
}

export default function UsersPage() {
  const { role } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        setError(error.message);
      } else {
        setUsers(data as UserRow[]);
      }
      setLoading(false);
    }
    if (role === 'ADMIN') {
      fetchUsers();
    }
  }, [role]);

  if (loading) return <p>Loading...</p>;
  if (role !== 'ADMIN') return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Email</th>
            <th className="px-4 py-2 border-b text-left">Role</th>
            <th className="px-4 py-2 border-b text-left">Corporate</th>
            <th className="px-4 py-2 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2 capitalize">{u.role.toLowerCase()}</td>
              <td className="px-4 py-2">{u.corporate_id ?? '—'}</td>
              <td className="px-4 py-2">{u.is_active ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-gray-600 mt-4">
        User creation is intentionally not implemented in this MVP skeleton.
        To create new users and assign roles, use the Supabase dashboard or create
        a server‑side API route that calls the Supabase admin API with your
        service role key.
      </p>
    </div>
  );
}