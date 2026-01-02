"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../components/AuthProvider';

interface Corporate {
  id: string;
  name: string;
  contact_email: string | null;
  phone: string | null;
  status: string | null;
}

export default function CorporatesPage() {
  const { role } = useAuth();
  const [corporates, setCorporates] = useState<Corporate[]>([]);
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCorporates() {
      const { data, error } = await supabase.from('corporates').select('*');
      if (error) {
        setError(error.message);
      } else {
        setCorporates(data as Corporate[]);
      }
      setLoading(false);
    }
    if (role === 'ADMIN') {
      fetchCorporates();
    }
  }, [role]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error: insertError } = await supabase
      .from('corporates')
      .insert({ name, contact_email: contactEmail || null, phone: phone || null })
      .select()
      .single();
    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      setCorporates((prev) => [...prev, data as Corporate]);
      setName('');
      setContactEmail('');
      setPhone('');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (role !== 'ADMIN') return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Corporates</h2>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      <ul className="space-y-2 mb-6">
        {corporates.map((corp) => (
          <li key={corp.id} className="p-2 bg-white border rounded">
            <div className="font-semibold">{corp.name}</div>
            <div className="text-sm text-gray-600">
              {corp.contact_email ?? 'N/A'} • {corp.phone ?? 'N/A'}
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow-md max-w-sm">
        <h3 className="font-medium mb-2">Add Corporate</h3>
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
            type="email"
            placeholder="Contact Email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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