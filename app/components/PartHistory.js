'use client';

import React, { useEffect, useState } from 'react';

export default function PartHistory() {
  const [data, setData] = useState([]);
  const [selectedPart, setSelectedPart] = useState('');

  // Load data from JSON
  useEffect(() => {
    fetch('/data/flat_part_history.json')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data.length) return <p>Loading part history...</p>;

  // Extract all unique parts
  const uniqueParts = [...new Set(data.map((row) => row["Désignation article"]))].sort();

  // Filter data by selected part
  const filteredData = selectedPart
    ? data.filter((row) => row["Désignation article"] === selectedPart)
    : [];

  return (
    <div className="container">
      <h2 className="section-title">🔧 Part Replacement History</h2>

      {/* Dropdown filter */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>
          Select Part:
        </label>
        <select
          value={selectedPart}
          onChange={(e) => setSelectedPart(e.target.value)}
          style={{ padding: '0.5rem', minWidth: '300px' }}
        >
          <option value="">-- Choose a part --</option>
          {uniqueParts.map((part, idx) => (
            <option key={idx} value={part}>
              {part}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {selectedPart && (
        <>
          <h3 className="section-title">
            Showing history for: <strong>{selectedPart}</strong>
          </h3>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Immatriculation</th>
                  <th>Désignation véhicule</th>
                  <th>History</th>
                  <th>Total Price (MAD)</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row["Immatriculation"]}</td>
                    <td>{row["Désignation véhicule"]}</td>
                    <td className="whitespace-pre-line top-align col-wide">{row["History"]}</td>
                    <td className="font-semibold text-green-700">{row["Total Price (MAD)"].toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
