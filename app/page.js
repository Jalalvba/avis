'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="main-page">
      <h1 className="section-title">Bienvenue sur le Dashboard</h1>
      <div className="big-button-container">
        <Link href="/ds">
          <button className="big-button">📋 DS</button>
        </Link>
        <Link href="/history">
          <button className="big-button">📅 Historique</button>
        </Link>
        <Link href="/parts">
          <button className="big-button">🛠️ Pièces</button>
        </Link>
      </div>
    </main>
  );
}
