"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../components/AuthProvider';

interface ContractRow {
  id: string;
  contract_no: string;
  type: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
}

interface VehicleRow {
  id: string;
  plate_no: string | null;
  make: string | null;
  model: string | null;
  status: string;
}

export default function CorporateHomePage() {
  const { role, user } = useAuth();
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      // fetch corporate id from profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('corporate_id')
        .eq('id', user.id)
        .single();
      const corporateId = profileData?.corporate_id;
      if (!corporateId) {
        setLoading(false);
        return;
      }
      // Fetch contracts for this corporate
      const { data: contractData, error: cErr } = await supabase
        .from('contracts')
        .select('*')
        .eq('corporate_id', corporateId);
      if (cErr) {
        setError(cErr.message);
        setLoading(false);
        return;
      } else {
        setContracts(contractData as ContractRow[]);
      }
      // Fetch vehicles assigned to this corporate via assignments
      const { data: assignmentData, error: aErr } = await supabase
        .from('contract_vehicle_assignments')
        .select('vehicle_id, vehicles(id, plate_no, make, model, status)')
        .in('contract_id', contractData?.map((c) => c.id) || []);
      if (aErr) {
        setError(aErr.message);
      } else {
        const vehs = (assignmentData as any[]).map((row) => row.vehicles) as VehicleRow[];
        setVehicles(vehs);
      }
      setLoading(false);
    }
    if (role === 'CORPORATE') {
      fetchData();
    }
  }, [role, user]);

  if (loading) return <p>Loading...</p>;
  if (role !== 'CORPORATE') return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Contracts</h2>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      <ul className="space-y-2 mb-6">
        {contracts.length > 0 ? (
          contracts.map((c) => (
            <li key={c.id} className="p-2 bg-white border rounded">
              <div className="font-semibold">{c.contract_no}</div>
              <div className="text-sm text-gray-600">
                {c.type} • {c.status}
              </div>
              <div className="text-xs text-gray-500">
                {c.start_date ?? '—'} to {c.end_date ?? '—'}
              </div>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-600">No contracts found.</p>
        )}
      </ul>
      <h2 className="text-xl font-semibold mb-4">My Vehicles</h2>
      <ul className="space-y-2 mb-6">
        {vehicles.length > 0 ? (
          vehicles.map((v) => (
            <li key={v.id} className="p-2 bg-white border rounded">
              <div className="font-semibold">{v.plate_no ?? v.id.substring(0, 8)}</div>
              <div className="text-sm text-gray-600">
                {v.make ?? ''} {v.model ?? ''}
              </div>
              <div className="text-xs text-gray-500">{v.status}</div>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-600">No vehicles assigned.</p>
        )}
      </ul>
    </div>
  );
}