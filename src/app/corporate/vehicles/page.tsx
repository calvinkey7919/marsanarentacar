"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../components/AuthProvider';

interface VehicleRow {
  id: string;
  plate_no: string | null;
  make: string | null;
  model: string | null;
  status: string;
}

export default function CorporateVehiclesPage() {
  const { role, user } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      if (!user) return;
      // Fetch corporate id from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('corporate_id')
        .eq('id', user.id)
        .single();
      const corporateId = profile?.corporate_id;
      if (!corporateId) {
        setLoading(false);
        return;
      }
      // Get assignments and vehicles
      const { data: assignments, error: assignErr } = await supabase
        .from('contract_vehicle_assignments')
        .select('vehicle_id, vehicles(id, plate_no, make, model, status)')
        .eq('status', 'ACTIVE');
      if (assignErr) {
        setError(assignErr.message);
        setLoading(false);
        return;
      }
      const vehs = (assignments as any[]).map((row) => row.vehicles) as VehicleRow[];
      setVehicles(vehs);
      setLoading(false);
    }
    if (role === 'CORPORATE') {
      fetchVehicles();
    }
  }, [role, user]);

  if (loading) return <p>Loading...</p>;
  if (role !== 'CORPORATE') return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Vehicles</h2>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
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