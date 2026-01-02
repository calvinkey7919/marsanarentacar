"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../components/AuthProvider';

interface Branch {
  id: string;
  name: string;
  address: string | null;
}

export default function BranchesPage() {
  const { role } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranches() {
      const { data, error } = await supabase.from('branches').select('*');
      if (error) {
        setError(error.message);
      } else {
        setBranches(data as Branch[]);
      }
      setLoading(false);
    }
    if (role === 'ADMIN') {
      fetchBranches();
    }
  }, [role]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error: insertError } = await supabase
      .from('branches')
      .insert({ name, address })
      .select()
      .single();
    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      setBranches((prev) => [...prev, data as Branch]);
      setName('');
      setAddress('');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (role !== 'ADMIN') return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Branches</h2>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      <ul className="space-y-2 mb-6">
        {branches.map((branch) => (
          <li key={branch.id} className="p-2 bg-white border rounded">
            <div className="font-semibold">{branch.name}</div>
            <div className="text-sm text-gray-600">{branch.address}</div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow-md max-w-sm">
        <h3 className="font-medium mb-2">Add Branch</h3>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-gray-300 rounded px-2 py-1"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border-gray-300 rounded px-2 py-1"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Add
        </button>
      </form>
    </div>
  );
}