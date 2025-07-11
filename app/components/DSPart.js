'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// ✅ Target order and loose-matching base
const TARGET_TYPES = [
  'mecanique',
  'service rapide',
  'diagnostic',
  'electrique',
  'pneumatique'
];

// Normalize string (remove accents + lowercase)
const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function DSPart() {
  const [data, setData] = useState({});
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [yearData, setYearData] = useState({});

  // === Load JSON ===
  useEffect(() => {
    fetch('/data/parts_stats_by_year.json')
      .then(res => res.json())
      .then(json => {
        const y = Object.keys(json).sort();
        setYears(y);
        setSelectedYear(y[y.length - 1]);
        setData(json);
      });
  }, []);

  // === Extract current year data ===
  useEffect(() => {
    if (selectedYear && data[selectedYear]) {
      setYearData(data[selectedYear]);
    }
  }, [selectedYear, data]);

  if (!Object.keys(yearData).length) return <p>Loading...</p>;

  // === Map raw types to normalized keys ===
  const normalizedMap = {};
  for (const [rawType, partSet] of Object.entries(yearData)) {
    const clean = normalize(rawType);
    normalizedMap[clean] = { rawType, partSet };
  }

  return (
    <div className="container">
      <h2 className="section-title">Parts by Type – {selectedYear}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Select Year: </label>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* === Show types in desired order using fuzzy match === */}
      {TARGET_TYPES.map(target => {
        // Try to find a matching normalized key
        const match = Object.keys(normalizedMap).find(k => k.includes(target));
        if (!match) return null;

        const { rawType, partSet } = normalizedMap[match];
        const partNames = Object.keys(partSet);
        const counts = partNames.map(p => partSet[p].Count);
        const totals = partNames.map(p => partSet[p].Total_HT_MAD);

        return (
          <div key={target} style={{ marginBottom: '4rem' }}>
            <h3 style={{ textTransform: 'capitalize' }}>{rawType}</h3>
            <Plot
              data={[
                {
                  type: 'bar',
                  name: 'Count',
                  x: partNames,
                  y: counts,
                  marker: { color: '#3b82f6' },
                  yaxis: 'y1'
                },
                {
                  type: 'scatter',
                  name: 'Total HT (MAD)',
                  mode: 'lines+markers',
                  x: partNames,
                  y: totals,
                  yaxis: 'y2',
                  line: { color: '#f97316', width: 3 }
                }
              ]}
              layout={{
                title: `Part Stats – ${rawType}`,
                barmode: 'group',
                margin: { t: 40, l: 60, r: 80, b: 100 },
                xaxis: { title: 'Part Name', automargin: true },
                yaxis: { title: 'Count', side: 'left' },
                yaxis2: {
                  title: 'Total HT (MAD)',
                  overlaying: 'y',
                  side: 'right'
                },
                legend: { orientation: 'h', y: -0.3 },
                autosize: true
              }}
              config={{ displayModeBar: false }}
              useResizeHandler
              style={{ width: '100%', height: '500px' }}
            />
            
          </div>
        );
      })}
      <div className="p-6 bg-red-50 rounded-xl border border-red-300 mt-10 space-y-6">
  <h2 className="text-2xl font-bold text-red-800">🧠 Analyse technique des erreurs de diagnostic fréquentes</h2>

  {/* Bruit moteur */}
  <div>
    <h3 className="text-xl font-semibold text-red-700 mb-1">🔊 1. Bruit moteur</h3>
    <p className="text-gray-800">
      De nombreux véhicules ont subi le remplacement de l’<strong>embrayage</strong> et du <strong>volant moteur</strong>
      sans qu’une origine précise du bruit n’ait été identifiée.
    </p>
    <ul className="list-disc list-inside text-gray-700 mt-2">
      <li><strong>Erreurs constatées :</strong> remplacement systématique sans vérification de la butée ou du palier intermédiaire</li>
      <li><strong>Diagnostic recommandé :</strong> test en charge, levée de véhicule, vérification du jeu au point mort, test bruit à chaud/froid</li>
      <li><strong>Outil nécessaire :</strong> stéthoscope mécanique, analyse des vibrations si possible</li>
    </ul>
  </div>

  {/* Manque de puissance */}
  <div>
    <h3 className="text-xl font-semibold text-red-700 mb-1">🐌 2. Manque de puissance</h3>
    <p className="text-gray-800">
      Plusieurs moteurs, turbos, et échangeurs ont été remplacés sans analyse correcte des codes défauts liés au débit d’air.
    </p>
    <ul className="list-disc list-inside text-gray-700 mt-2">
      <li><strong>Erreurs constatées :</strong> remplacement moteur/turbo pour code P0101 ou P0299 sans vérification</li>
      <li><strong>Diagnostic recommandé :</strong> lecture des valeurs réelles (pression suralimentation, débitmètre, position wastegate)</li>
      <li><strong>Outil nécessaire :</strong> valise Launch ou Autel, outil d’analyse graphique en temps réel</li>
    </ul>
  </div>

  {/* Suspension / direction */}
  <div>
    <h3 className="text-xl font-semibold text-red-700 mb-1">🛞 3. Défaut de tenue de route ou direction dure</h3>
    <p className="text-gray-800">
      Des composants comme les <strong>amortisseurs</strong>, les <strong>biellettes</strong> et même la <strong>crémaillère</strong>
      ont été changés sans mesure de géométrie.
    </p>
    <ul className="list-disc list-inside text-gray-700 mt-2">
      <li><strong>Erreurs constatées :</strong> remplacement de la crémaillère alors qu’un simple réglage suffisait</li>
      <li><strong>Diagnostic recommandé :</strong> test de géométrie 3D, contrôle des silent-blocs et bras inférieurs</li>
      <li><strong>Outil nécessaire :</strong> banc de géométrie 3D avec rapport imprimable à joindre au devis</li>
    </ul>
  </div>

  {/* Fuite liquide refroidissement */}
  <div>
    <h3 className="text-xl font-semibold text-red-700 mb-1">💧 4. Fuite de liquide de refroidissement</h3>
    <p className="text-gray-800">
      Des circuits entiers (pompe à eau, thermostat, échangeur, durites) ont été remplacés sans localisation de fuite.
    </p>
    <ul className="list-disc list-inside text-gray-700 mt-2">
      <li><strong>Erreurs constatées :</strong> remplacement global sans test de pression ni inspection visuelle ciblée</li>
      <li><strong>Diagnostic recommandé :</strong> test de pression avec bouchon adaptateur, détection de traces blanches (résidus de glycol)</li>
      <li><strong>Outil nécessaire :</strong> kit de test pression + lampe UV si liquide fluorescent utilisé</li>
    </ul>
  </div>

  {/* Conclusion */}
  <div className="pt-4 border-t">
    <p className="text-gray-900 font-medium">
      👉 Ces erreurs ont un impact économique direct. Il est essentiel d’<strong>investir dans les bons outils</strong>,
      de <strong>former les techniciens au diagnostic structuré</strong> et de
      <strong>standardiser les procédures de vérification</strong> avant tout remplacement de pièce coûteuse.
    </p>
  </div>
</div>

    </div>
  );
}
