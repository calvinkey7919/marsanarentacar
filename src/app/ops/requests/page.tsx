"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../components/AuthProvider';

interface Request {
  id: string;
  corporate_id: string;
  type: string;
  priority: string;
  subject: string;
  status: string;
  vehicle_id: string | null;
  created_at: string;
  assigned_to_user_id: string | null;
  corporate_name?: string;
  vehicle_plate?: string;
}

export default function OpsRequestsPage() {
  const { role, user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      let query = supabase
        .from('requests')
        .select('*, corporates(name), vehicles(plate_no)')
        .order('created_at', { ascending: false });
      if (statusFilter) query = query.eq('status', statusFilter);
      if (priorityFilter) query = query.eq('priority', priorityFilter);
      const { data, error } = await query;
      if (error) {
        setError(error.message);
      } else {
        // Map joined values into request fields
        const mapped = (data as any[]).map((row) => ({
          id: row.id,
          corporate_id: row.corporate_id,
          type: row.type,
          priority: row.priority,
          subject: row.subject,
          status: row.status,
          vehicle_id: row.vehicle_id,
          created_at: row.created_at,
          assigned_to_user_id: row.assigned_to_user_id,
          corporate_name: row.corporates?.name ?? '—',
          vehicle_plate: row.vehicles?.plate_no ?? '—',
        })) as Request[];
        setRequests(mapped);
      }
      setLoading(false);
    }
    if (role === 'OPS' || role === 'ADMIN') {
      fetchRequests();
    }
  }, [role, statusFilter, priorityFilter]);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    const { error } = await supabase
      .from('requests')
      .update({ status: newStatus })
      .eq('id', requestId);
    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r)));
    }
  };

  const handleAssignToMe = async (requestId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('requests')
      .update({ assigned_to_user_id: user.id })
      .eq('id', requestId);
    if (error) {
      alert('Error assigning: ' + error.message);
    } else {
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, assigned_to_user_id: user.id } : r)));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (role !== 'OPS' && role !== 'ADMIN') return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Requests Inbox</h2>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="WAITING_CUSTOMER">Waiting customer</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Priority</label>
          <select
            value={priorityFilter || ''}
            onChange={(e) => setPriorityFilter(e.target.value || null)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All</option>
            <option value="LOW">Low</option>
            <option value="MED">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>
      <table className="min-w-full bg-white rounded shadow text-sm">
        <thead>
          <tr>
            <th className="px-2 py-2 border-b">Subject</th>
            <th className="px-2 py-2 border-b">Corporate</th>
            <th className="px-2 py-2 border-b">Vehicle</th>
            <th className="px-2 py-2 border-b">Type</th>
            <th className="px-2 py-2 border-b">Priority</th>
            <th className="px-2 py-2 border-b">Status</th>
            <th className="px-2 py-2 border-b">Assigned</th>
            <th className="px-2 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b hover:bg-gray-50">
              <td className="px-2 py-2 max-w-xs truncate" title={req.subject}>{req.subject}</td>
              <td className="px-2 py-2">{req.corporate_name}</td>
              <td className="px-2 py-2">{req.vehicle_plate}</td>
              <td className="px-2 py-2 capitalize">{req.type.toLowerCase()}</td>
              <td className="px-2 py-2 capitalize">{req.priority.toLowerCase()}</td>
              <td className="px-2 py-2">
                <select
                  value={req.status}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                  className="border rounded px-1 py-0.5 text-sm"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="WAITING_CUSTOMER">Waiting customer</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </td>
              <td className="px-2 py-2">
                {req.assigned_to_user_id === user?.id ? 'You' : req.assigned_to_user_id ? 'Other' : '—'}
              </td>
              <td className="px-2 py-2 text-right">
                {!req.assigned_to_user_id && (
                  <button
                    onClick={() => handleAssignToMe(req.id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                  >
                    Assign to me
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-gray-600 mt-4">
        For full request details and comments, implement a detail page and comment
        thread component.  Currently this page allows status updates and simple
        assignment.
      </p>
    </div>
  );
}