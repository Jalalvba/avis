'use client';
import DSChart from '@/components/DSChart';
import DSType from '@/components/DSType';
import DSPart from '@/components/DSPart';



export default function DSChartPage() {
  return (
    <div className="container">
      <h2 className="section-title">Résumé Graphique</h2>
      <DSChart />
      <DSType/>
      <DSPart/>
    </div>
  );
}
