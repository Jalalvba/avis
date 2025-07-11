'use client';
import React, { useEffect, useState } from 'react';

export default function DSTable() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [threshold, setThreshold] = useState('');

  useEffect(() => {
    fetch('/data/DS_Complet.json')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data.length) return <p>Loading DS table...</p>;

  const headers = Object.keys(data[0]);

  // === Filter Logic ===
  const filteredData = data.filter((row) => {
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return String(row[key]).toLowerCase().includes(value.toLowerCase());
    });

    const mtValue = parseFloat(row["Mt HT DS"]);
    const passesThreshold =
      !threshold || (mtValue && !isNaN(mtValue) && mtValue >= parseFloat(threshold));

    return matchesFilters && passesThreshold;
  });

  // === Handle input change ===
  const handleFilterChange = (col, value) => {
    setFilters({ ...filters, [col]: value });
  };

  return (
    <div className="container">
      <h2 className="section-title">Intervention Details (DS_Complet)</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>
          Mt HT DS ≥ 
        </label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder="Enter min value"
          style={{ padding: '0.5rem', width: '150px' }}
        />
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>
                  {header}
                  <div>
                    <input
                      type="text"
                      placeholder="Filter"
                      value={filters[header] || ''}
                      onChange={(e) => handleFilterChange(header, e.target.value)}
                      style={{ width: '100%', fontSize: '0.8rem' }}
                    />
                  </div>
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
                      col === "Résumé intervention"
                        ? "whitespace-pre-line top-align col-wide"
                        : ["Année", "Mois", "User"].includes(col)
                        ? "col-narrow"
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
