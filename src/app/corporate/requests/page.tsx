"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../components/AuthProvider';

interface RequestRow {
  id: string;
  type: string;
  priority: string;
  subject: string;
  description: string;
  status: string;
  vehicle_id: string | null;
  created_at: string;
}

interface VehicleRow {
  id: string;
  plate_no: string | null;
}

export default function CorporateRequestsPage() {
  const { role, user } = useAuth();
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [formState, setFormState] = useState({
    type: 'MAINTENANCE',
    priority: 'MED',
    subject: '',
    description: '',
    vehicle_id: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      // Get corporate id
      const { data: profile } = await supabase
        .from('profiles')
        .select('corporate_id')
        .eq('id', user.id)
        .single();
      const corpId = profile?.corporate_id;
      if (!corpId) {
        setLoading(false);
        return;
      }
      // Fetch requests created by this corporate
      const { data: reqData, error: reqErr } = await supabase
        .from('requests')
        .select('*')
        .eq('corporate_id', corpId)
        .order('created_at', { ascending: false });
      if (reqErr) {
        setError(reqErr.message);
      } else {
        setRequests(reqData as RequestRow[]);
      }
      // Fetch vehicles assigned to this corporate via assignments
      const { data: assignments } = await supabase
        .from('contract_vehicle_assignments')
        .select('vehicle_id, vehicles(id, plate_no)')
        .eq('status', 'ACTIVE');
      const vehs = (assignments as any[]).map((row) => row.vehicles) as VehicleRow[];
      setVehicles(vehs);
      setLoading(false);
    }
    if (role === 'CORPORATE') {
      fetchData();
    }
  }, [role, user]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    // Get corporate id
    const { data: profile } = await supabase
      .from('profiles')
      .select('corporate_id')
      .eq('id', user.id)
      .single();
    const corpId = profile?.corporate_id;
    if (!corpId) return;
    const { type, priority, subject, description, vehicle_id } = formState;
    const { data, error: insertError } = await supabase
      .from('requests')
      .insert({
        corporate_id: corpId,
        created_by_user_id: user.id,
        type,
        priority,
        subject,
        description,
        vehicle_id: vehicle_id || null,
      })
      .select()
      .single();
    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      setRequests((prev) => [data as RequestRow, ...prev]);
      setFormState({ type: 'MAINTENANCE', priority: 'MED', subject: '', description: '', vehicle_id: '' });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (role !== 'CORPORATE') return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Requests</h2>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow-md mb-6 max-w-md">
        <h3 className="font-medium mb-2">Create New Request</h3>
        <div className="mb-2">
          <label className="block text-sm mb-1">Type</label>
          <select
            name="type"
            value={formState.type}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm w-full"
          >
            <option value="MAINTENANCE">Maintenance</option>
            <option value="SERVICE">Service</option>
            <option value="SUPPORT">Support</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">Priority</label>
          <select
            name="priority"
            value={formState.priority}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm w-full"
          >
            <option value="LOW">Low</option>
            <option value="MED">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">Vehicle (optional)</label>
          <select
            name="vehicle_id"
            value={formState.vehicle_id}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm w-full"
          >
            <option value="">—</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate_no ?? v.id.substring(0, 8)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">Subject</label>
          <input
            name="subject"
            value={formState.subject}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm w-full"
            rows={3}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
          Create request
        </button>
      </form>
      <ul className="space-y-2">
        {requests.length > 0 ? (
          requests.map((req) => (
            <li key={req.id} className="p-3 bg-white border rounded">
              <div className="flex justify-between items-center">
                <div className="font-semibold">{req.subject}</div>
                <div className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString()}</div>
              </div>
              <div className="text-sm text-gray-600">
                {req.type} • {req.priority} • {req.status}
              </div>
              {req.description && (
                <p className="text-sm mt-1 line-clamp-3">{req.description}</p>
              )}
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-600">No requests yet.</p>
        )}
      </ul>
      <p className="text-sm text-gray-600 mt-4">
        After creating a request, you cannot edit its fields.  You may implement
        a comment thread in a future version.
      </p>
    </div>
  );
}