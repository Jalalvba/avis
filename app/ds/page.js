'use client';
import Link from 'next/link';

export default function DSPage() {
  return (
    <div className="container">
      <h2 className="section-title">DS - Choisissez une vue</h2>
      <div className="button-group">
        <Link href="/ds/chart">
          <button className="big-button">📊 Résumé Graphique</button>
        </Link>
        <Link href="/ds/table">
          <button className="big-button">📋 Détail Complet</button>
        </Link>
      </div>
    </div>
  );
}
