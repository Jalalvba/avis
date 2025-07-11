'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function DSChart() {
  const [chartData, setChartData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [monthlyTotals, setMonthlyTotals] = useState([]);

  useEffect(() => {
    fetch('/data/DS_Résumé.json')
      .then(res => res.json())
      .then(res => {
        setChartData(res.data || []);
        setMeta(res.meta || {});
        setMonthlyTotals(res.monthly_totals || []);
      })
      .catch(console.error);
  }, []);

  if (!chartData.length || !meta) return <p>Loading chart...</p>;

  const dates = chartData.map(item => item.DateStr);
  const dsCounts = chartData.map(item => item.Nombre_DS);
  const mtHTperDS = chartData.map(item => item.Mt_HT_par_DS);

  const monthColor = 'rgba(200, 200, 200, 0.15)';
  const monthBackground = [];

  monthlyTotals.forEach(entry => {
    const [year, month] = entry.Month.split('-');
    const start = `${entry.Month}-01`;
    const end = new Date(year, month, 0).toISOString().split('T')[0];
    monthBackground.push({
      type: 'rect',
      xref: 'x',
      yref: 'paper',
      x0: start,
      x1: end,
      y0: 0,
      y1: 1,
      fillcolor: monthColor,
      opacity: 0.5,
      layer: 'below',
      line: { width: 0 }
    });
  });

  return (
    <div className="container">
      <h2 className="section-title">Nombre de DS par Jour + Montant HT / DS</h2>
      <Plot
        data={[
          {
            type: 'bar',
            x: dates,
            y: dsCounts,
            name: 'Nombre DS',
            marker: { color: '#1e90ff' },
            yaxis: 'y1'
          },
          {
            type: 'scatter',
            mode: 'lines+markers',
            x: dates,
            y: mtHTperDS,
            name: 'Montant HT / DS',
            yaxis: 'y2',
            line: { color: '#f97316' }
          }
        ]}
        layout={{
          margin: { t: 40, l: 60, r: 120, b: 80 },
          xaxis: { title: 'Date', tickangle: -45 },
          yaxis: { title: 'Nombre DS', side: 'left', showgrid: true },
          yaxis2: {
            title: 'Mt HT / DS (MAD)',
            overlaying: 'y',
            side: 'right',
            showgrid: false
          },
          shapes: [
            ...monthBackground,
            {
              type: 'line', xref: 'paper', yref: 'y',
              x0: 0, x1: 1, y0: meta.line_mean_ds, y1: meta.line_mean_ds,
              line: { color: '#16a34a', width: 2, dash: 'dash' }
            },
            {
              type: 'line', xref: 'paper', yref: 'y',
              x0: 0, x1: 1, y0: meta.line_upper_ds, y1: meta.line_upper_ds,
              line: { color: 'red', width: 2, dash: 'dot' }
            },
            {
              type: 'line', xref: 'paper', yref: 'y',
              x0: 0, x1: 1, y0: meta.line_lower_ds, y1: meta.line_lower_ds,
              line: { color: 'purple', width: 2, dash: 'dot' }
            },
            {
              type: 'line', xref: 'paper', yref: 'y2',
              x0: 0, x1: 1, y0: meta.line_mean_mt_ht, y1: meta.line_mean_mt_ht,
              line: { color: '#f97316', width: 2, dash: 'dashdot' }
            },
            {
              type: 'line', xref: 'paper', yref: 'y2',
              x0: 0, x1: 1, y0: meta.line_upper_mt_ht, y1: meta.line_upper_mt_ht,
              line: { color: '#f97316', width: 2, dash: 'dot' }
            },
            {
              type: 'line', xref: 'paper', yref: 'y2',
              x0: 0, x1: 1, y0: meta.line_lower_mt_ht, y1: meta.line_lower_mt_ht,
              line: { color: '#f97316', width: 2, dash: 'dot' }
            }
          ],
          annotations: [
            {
              xref: 'paper', yref: 'y', x: 1.1, y: meta.line_mean_ds,
              text: `µ DS = ${meta.line_mean_ds}`,
              showarrow: false,
              font: { color: '#16a34a', size: 14 }, align: 'left'
            },
            {
              xref: 'paper', yref: 'y', x: 1.1, y: meta.line_upper_ds,
              text: `+σ DS = ${meta.line_upper_ds}`,
              showarrow: false,
              font: { color: 'red', size: 14 }, align: 'left'
            },
            {
              xref: 'paper', yref: 'y', x: 1.1, y: meta.line_lower_ds,
              text: `-σ DS = ${meta.line_lower_ds}`,
              showarrow: false,
              font: { color: 'purple', size: 14 }, align: 'left'
            },
            {
              xref: 'paper', yref: 'y2', x: 1.1, y: meta.line_mean_mt_ht,
              text: `µ HT = ${meta.line_mean_mt_ht}`,
              showarrow: false,
              font: { color: '#f97316', size: 14 }, align: 'left'
            },
            {
              xref: 'paper', yref: 'y2', x: 1.1, y: meta.line_upper_mt_ht,
              text: `+σ HT = ${meta.line_upper_mt_ht}`,
              showarrow: false,
              font: { color: '#f97316', size: 14 }, align: 'left'
            },
            {
              xref: 'paper', yref: 'y2', x: 1.1, y: meta.line_lower_mt_ht,
              text: `-σ HT = ${meta.line_lower_mt_ht}`,
              showarrow: false,
              font: { color: '#f97316', size: 14 }, align: 'left'
            }
          ],
          legend: { orientation: 'h', y: -0.3 },
          hovermode: 'x unified',
          autosize: true
        }}
        useResizeHandler
        style={{ width: '100%', height: '600px' }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
