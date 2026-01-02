"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../components/AuthProvider';

interface Vehicle {
  id: string;
  vin: string | null;
  plate_no: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  branch_id: string | null;
  status: string;
  odometer: number | null;
  notes: string | null;
}

interface Branch {
  id: string;
  name: string;
}

export default function FleetPage() {
  const { role } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [branchFilter, setBranchFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch branches for filter options
      const { data: branchData } = await supabase.from('branches').select('id, name');
      setBranches((branchData as Branch[]) || []);
      // Build query with filters
      let query = supabase.from('vehicles').select('*');
      if (statusFilter) query = query.eq('status', statusFilter);
      if (branchFilter) query = query.eq('branch_id', branchFilter);
      const { data, error } = await query;
      if (error) {
        setError(error.message);
      } else {
        setVehicles(data as Vehicle[]);
      }
      setLoading(false);
    }
    if (role === 'OPS' || role === 'ADMIN') {
      fetchData();
    }
  }, [role, statusFilter, branchFilter]);

  const handleStatusChange = async (vehicleId: string, newStatus: string) => {
    const { error, data } = await supabase
      .from('vehicles')
      .update({ status: newStatus })
      .eq('id', vehicleId)
      .select()
      .single();
    if (error) {
      alert('Error updating status: ' + error.message);
    } else if (data) {
      setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v)));
    }
  };

  const handleBranchChange = async (vehicleId: string, newBranchId: string) => {
    const { error, data } = await supabase
      .from('vehicles')
      .update({ branch_id: newBranchId })
      .eq('id', vehicleId)
      .select()
      .single();
    if (error) {
      alert('Error updating branch: ' + error.message);
    } else if (data) {
      setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, branch_id: newBranchId } : v)));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (role !== 'OPS' && role !== 'ADMIN') return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Fleet</h2>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="border rounded px-2 py-1"
            >
              <option value="">All</option>
              <option value="AVAILABLE">Available</option>
              <option value="RENTED">Rented</option>
              <option value="LEASED">Leased</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of service</option>
              <option value="IN_SERVICE">In service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Branch</label>
            <select
              value={branchFilter || ''}
              onChange={(e) => setBranchFilter(e.target.value || null)}
              className="border rounded px-2 py-1"
            >
              <option value="">All</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
      </div>
      <table className="min-w-full bg-white rounded shadow text-sm">
        <thead>
          <tr>
            <th className="px-2 py-2 border-b">Plate</th>
            <th className="px-2 py-2 border-b">Make/Model</th>
            <th className="px-2 py-2 border-b">Branch</th>
            <th className="px-2 py-2 border-b">Status</th>
            <th className="px-2 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => {
            const currentBranch = branches.find((b) => b.id === v.branch_id);
            return (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="px-2 py-2">{v.plate_no ?? '—'}</td>
                <td className="px-2 py-2">{`${v.make ?? ''} ${v.model ?? ''}`}</td>
                <td className="px-2 py-2">
                  <select
                    value={v.branch_id || ''}
                    onChange={(e) => handleBranchChange(v.id, e.target.value || null)}
                    className="border rounded px-1 py-0.5 text-sm"
                  >
                    <option value="">—</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select
                    value={v.status}
                    onChange={(e) => handleStatusChange(v.id, e.target.value)}
                    className="border rounded px-1 py-0.5 text-sm"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RENTED">Rented</option>
                    <option value="LEASED">Leased</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OUT_OF_SERVICE">Out of service</option>
                    <option value="IN_SERVICE">In service</option>
                  </select>
                </td>
                <td className="px-2 py-2">{/* Placeholder for future actions */}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-sm text-gray-600 mt-4">
        To add or edit vehicles, implement a form here or import via CSV.
      </p>
    </div>
  );
}