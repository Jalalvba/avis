'use client';
import React, { useEffect, useState } from 'react';

export default function VehicleHistoryTable() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [threshold, setThreshold] = useState('');
  const [partSearch, setPartSearch] = useState('');

  useEffect(() => {
    fetch('/data/history_by_vehicle.json')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data.length) return <p>Loading vehicle history...</p>;

  const headers = Object.keys(data[0]);

  const filteredData = data.filter((row) => {
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return String(row[key]).toLowerCase().includes(value.toLowerCase());
    });

    const total = parseFloat(row["Total Price (MAD)"]);
    const passesThreshold =
      !threshold || (total && !isNaN(total) && total >= parseFloat(threshold));

    const matchesPart =
      !partSearch ||
      String(row["Intervention History"]).toLowerCase().includes(partSearch.toLowerCase());

    return matchesFilters && passesThreshold && matchesPart;
  });

  const handleFilterChange = (col, value) => {
    setFilters({ ...filters, [col]: value });
  };

  return (
    <div className="container">
      <h2 className="section-title">🚗 Vehicle Intervention History</h2>

      {/* Global filters */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>
          Total Price ≥
        </label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder="Min total MAD"
          style={{ padding: '0.5rem', width: '150px', marginRight: '1rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>
          Search Part Name 🔍
        </label>
        <input
          type="text"
          value={partSearch}
          onChange={(e) => setPartSearch(e.target.value)}
          placeholder="e.g. filtre, pneu..."
          style={{ padding: '0.5rem', width: '250px' }}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>
                  {header}
                  {!["Intervention History", "Total Price (MAD)", "Immatriculation"].includes(header) && (
                    <div>
                      <input
                        type="text"
                        placeholder="Filter"
                        value={filters[header] || ''}
                        onChange={(e) => handleFilterChange(header, e.target.value)}
                        style={{ width: '100%', fontSize: '0.8rem' }}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                {headers.map((col) => (
                  <td
                    key={col}
                    className={`${
                      col === "Intervention History"
                        ? "whitespace-pre-line top-align col-wide"
                        : col === "Total Price (MAD)"
                        ? "font-semibold text-green-700"
                        : ""
                    }`}
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
