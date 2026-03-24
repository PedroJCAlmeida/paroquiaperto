'use client';
import React from 'react';
import Link from 'next/link';
import '@/styles/Navbar.css';

export default function BackofficeNavbar() {
  return (
    <header className="navbar" style={{ marginBottom: '2rem' }}>
      <div className="navbar-inner">
        <nav className="navbar-nav" style={{ justifyContent: 'center' }}>
          <Link href="/backoffice/paroquias" className="navbar-link">Inserir Paróquia</Link>
          <Link href="/backoffice/horarios" className="navbar-link">Inserir Horários</Link>
          <Link href="/backoffice/eventos" className="navbar-link">Inserir Eventos</Link>
        </nav>
      </div>
    </header>
  );
}
