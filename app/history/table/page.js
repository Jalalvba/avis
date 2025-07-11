'use client';
import VehicleHistoryTable from '@/components/VehicleHistoryTable';

export default function HistoryTablePage() {
  return (
    <div className="container">
      <h2 className="section-title">📘 Historique par Immatriculation</h2>
      <VehicleHistoryTable />
    </div>
  );
}
