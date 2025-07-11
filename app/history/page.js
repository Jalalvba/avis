'use client';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="container">
      <h2 className="section-title">History - Choisissez une vue</h2>
      <div className="button-group">
        <Link href="/history/chart">
          <button className="big-button">📊 Résumé Graphique</button>
        </Link>
        <Link href="/history/table">
          <button className="big-button">📘 Historique par Immatriculation</button>
        </Link>
      </div>
    </div>
  );
}
