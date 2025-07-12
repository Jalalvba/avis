'use client';
import Link from 'next/link';

export default function PartPage() {
  return (
    <div className="container">
      <h2 className="section-title">History - Choisissez une vue</h2>
      <div className="button-group">
        <Link href="/parts/chart">
          <button className="big-button">📊 Résumé Graphique</button>
        </Link>
        <Link href="/parts/table">
          <button className="big-button">📘 Historique par Part</button>
        </Link>
      </div>
    </div>
  );
}
