'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Calendar, PlusCircle } from 'lucide-react';
import '@/styles/BackofficeMenu.css';

export default function BackofficeMenu() {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 700);
      if (window.innerWidth > 700) setExpanded(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavClick = () => {
    if (isMobile) setExpanded(false);
  };

  return (
    <>
      {isMobile && !expanded && (
        <button
          style={{ position: 'fixed', top: 16, left: 16, background: '#fff', border: '1px solid #ddd', borderRadius: '50%', width: 44, height: 44, fontSize: '2rem', cursor: 'pointer', zIndex: 1001, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          onClick={() => setExpanded(true)}
          aria-label="Abrir menu"
        >☰</button>
      )}
      <nav
        className={`backoffice-menu${expanded ? ' expanded' : ' collapsed'}${isMobile ? ' mobile' : ''}`}
        style={{ width: expanded ? (isMobile ? '80vw' : '220px') : (isMobile ? '0' : '48px'), maxWidth: isMobile ? '320px' : '220px', minWidth: isMobile ? '0' : '48px', transition: 'width 0.3s', overflow: 'hidden', minHeight: '100vh', background: '#f5f5f5', borderRight: '1px solid #ddd', position: isMobile ? 'fixed' : 'relative', top: 0, left: 0, zIndex: isMobile ? 1000 : 1 }}
      >
        <button
          style={{ position: 'absolute', top: 10, right: expanded ? 10 : 'auto', left: expanded ? 'auto' : 10, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', zIndex: 2, color: '#333' }}
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
        >
          {expanded ? (isMobile ? '✕' : '←') : '☰'}
        </button>
        <ul style={{ listStyle: 'none', padding: expanded ? (isMobile ? '2rem 0 0 0' : '0') : '0', marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '2rem' : '1.5rem' }}>
          <li>
            <Link href="/backoffice/paroquias" style={{ display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 'bold', fontSize: isMobile ? '1.3rem' : '1rem', padding: isMobile ? '1rem 2rem' : '0.5rem 0', width: '100%' }} onClick={handleNavClick}>
              <Home size={isMobile ? 28 : 22} style={{ marginRight: expanded ? '12px' : '0' }} />
              {expanded && <span>Inserir Paróquia</span>}
            </Link>
          </li>
          <li>
            <Link href="/backoffice/horarios" style={{ display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 'bold', fontSize: isMobile ? '1.3rem' : '1rem', padding: isMobile ? '1rem 2rem' : '0.5rem 0', width: '100%' }} onClick={handleNavClick}>
              <Calendar size={isMobile ? 28 : 22} style={{ marginRight: expanded ? '12px' : '0' }} />
              {expanded && <span>Inserir Horários</span>}
            </Link>
          </li>
          <li>
            <Link href="/backoffice/eventos" style={{ display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 'bold', fontSize: isMobile ? '1.3rem' : '1rem', padding: isMobile ? '1rem 2rem' : '0.5rem 0', width: '100%' }} onClick={handleNavClick}>
              <PlusCircle size={isMobile ? 28 : 22} style={{ marginRight: expanded ? '12px' : '0' }} />
              {expanded && <span>Inserir Eventos</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
