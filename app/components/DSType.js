'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const TYPE_COLORS = {
  carrosserie: '#6b7280',
  diagnostic: '#6366f1',
  electrique: '#a855f7',
  mecanique: '#10b981',
  pneumatique: '#0ea5e9',
  'service rapide': '#f97316'
};

export default function DSMonthlyChartWithReferences() {
  const [data, setData] = useState({});
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [metaRef, setMetaRef] = useState({});
  const [monthData, setMonthData] = useState([]);

  useEffect(() => {
    fetch('/data/DS_Travaux_Stats_All.json')
      .then(res => res.json())
      .then(res => {
        setData(res.data || {});
        setMonths(res.meta || []);
        setMetaRef(res.meta_reference || {});
        if (res.meta && res.meta.length) {
          setSelectedMonth(res.meta[res.meta.length - 1]);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedMonth && data[selectedMonth]) {
      setMonthData(data[selectedMonth]);
    }
  }, [selectedMonth, data]);

  if (!monthData.length) return <p>Chargement...</p>;

  const xLabels = monthData.map(item => item.type_travaux_dominant);
  const nombreDS = monthData.map(item => item.Nombre_DS);
  const totalHT = monthData.map(item => item.Total_HT_MAD);

  const shapes = [];

  xLabels.forEach(type => {
    const ref = metaRef[type];
    if (!ref) return;

    // DS
    shapes.push({
      type: 'line',
      xref: 'paper',
      yref: 'y1',
      x0: 0,
      x1: 1,
      y0: ref.mean_nombre_ds,
      y1: ref.mean_nombre_ds,
      line: { color: TYPE_COLORS[type], width: 1.5, dash: 'dash' }
    });
    shapes.push({
      type: 'line',
      xref: 'paper',
      yref: 'y1',
      x0: 0,
      x1: 1,
      y0: ref.mean_nombre_ds + ref.std_nombre_ds,
      y1: ref.mean_nombre_ds + ref.std_nombre_ds,
      line: { color: TYPE_COLORS[type], width: 1, dash: 'dot' }
    });
    shapes.push({
      type: 'line',
      xref: 'paper',
      yref: 'y1',
      x0: 0,
      x1: 1,
      y0: ref.mean_nombre_ds - ref.std_nombre_ds,
      y1: ref.mean_nombre_ds - ref.std_nombre_ds,
      line: { color: TYPE_COLORS[type], width: 1, dash: 'dot' }
    });

    // HT
    shapes.push({
      type: 'line',
      xref: 'paper',
      yref: 'y2',
      x0: 0,
      x1: 1,
      y0: ref.mean_total_ht,
      y1: ref.mean_total_ht,
      line: { color: TYPE_COLORS[type], width: 1.5, dash: 'dashdot' }
    });
    shapes.push({
      type: 'line',
      xref: 'paper',
      yref: 'y2',
      x0: 0,
      x1: 1,
      y0: ref.mean_total_ht + ref.std_total_ht,
      y1: ref.mean_total_ht + ref.std_total_ht,
      line: { color: TYPE_COLORS[type], width: 1, dash: 'dot' }
    });
    shapes.push({
      type: 'line',
      xref: 'paper',
      yref: 'y2',
      x0: 0,
      x1: 1,
      y0: ref.mean_total_ht - ref.std_total_ht,
      y1: ref.mean_total_ht - ref.std_total_ht,
      line: { color: TYPE_COLORS[type], width: 1, dash: 'dot' }
    });
  });

  return (
    <div className="container">
      <h2 className="section-title">Analyse par Type – {selectedMonth}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Choisir un mois : </label>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
          {months.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <Plot
        data={[
          {
            type: 'bar',
            x: xLabels,
            y: nombreDS,
            name: 'Nombre de DS',
            marker: { color: '#3b82f6' },
            yaxis: 'y1'
          },
          {
            type: 'scatter',
            mode: 'lines+markers',
            x: xLabels,
            y: totalHT,
            name: 'Total HT MAD',
            yaxis: 'y2',
            line: { color: '#f97316', width: 3 }
          }
        ]}
        layout={{
          barmode: 'group',
          margin: { t: 40, l: 60, r: 80, b: 80 },
          xaxis: { title: 'Type de travaux' },
          yaxis: { title: 'Nombre de DS', side: 'left', showgrid: true },
          yaxis2: {
            title: 'Total HT (MAD)',
            overlaying: 'y',
            side: 'right',
            showgrid: false
          },
          shapes,
          legend: { orientation: 'h', y: -0.25 },
          hovermode: 'x unified',
          autosize: true
        }}
        config={{ displayModeBar: false }}
        useResizeHandler
        style={{ width: '100%', height: '600px' }}
      />

      <div style={{ marginTop: '2rem' }}>
        <h3>Références statistiques (moyenne µ et écart-type σ)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Type</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>µ Nombre DS</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>σ DS</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>µ Total HT (MAD)</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>σ HT</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(metaRef).map(([type, ref]) => (
              <tr key={type} style={{ color: TYPE_COLORS[type] || '#000' }}>
                <td style={{ padding: '6px' }}>{type}</td>
                <td style={{ padding: '6px' }}>{ref.mean_nombre_ds.toFixed(1)}</td>
                <td style={{ padding: '6px' }}>{ref.std_nombre_ds.toFixed(1)}</td>
                <td style={{ padding: '6px' }}>{ref.mean_total_ht.toLocaleString()}</td>
                <td style={{ padding: '6px' }}>{ref.std_total_ht.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bloc de dimensionnement */}
      <section className="p-4 bg-white rounded-xl shadow mt-10 border">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Dimensionnement opérationnel – Mai 2025
        </h2>

        <p className="mb-2">
          L’analyse du mois de mai révèle un flux moyen de <strong>30 à 40 entrées atelier/jour</strong>, réparties comme suit :
        </p>

        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li><strong>Service rapide :</strong> 26 entrées/jour</li>
          <li><strong>Pneumatique :</strong> 6 entrées/jour</li>
          <li><strong>Travaux lourds (mécanique, diagnostic, etc.) :</strong> 4 entrées/jour</li>
        </ul>

        <h3 className="font-semibold text-gray-800 mt-4">👨‍🔧 Ressources recommandées :</h3>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li><strong>4 techniciens Express</strong> polyvalents pour assurer le service rapide.</li>
          <li><strong>1 technicien Pneumatique</strong> dédié aux montages, équilibrages et géométries.</li>
          <li><strong>2 techniciens Mécanique</strong> expérimentés pour les travaux lourds, assistés de <strong>2 techniciens polyvalents</strong>.</li>
          <li><strong>2 techniciens Diagnostic</strong> spécialisés, équipés de valises constructeur.</li>
        </ul>

        <p className="text-gray-700">
          Cette organisation garantit une bonne répartition de la charge, une réactivité sur les pics d’activité,
          et un bon équilibre entre spécialisation et polyvalence.
        </p>
      </section>
    </div>
  );
}
