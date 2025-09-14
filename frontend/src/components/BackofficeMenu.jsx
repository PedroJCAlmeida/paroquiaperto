// BackofficeMenu.jsx
import React, { useState } from 'react';
import { Home, Calendar, PlusCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import '../styles/BackofficeMenu.css';

export default function BackofficeMenu() {
  const [expanded, setExpanded] = useState(true);
  return (
    <nav
      className={`backoffice-menu${expanded ? ' expanded' : ' collapsed'}`}
      style={{
        width: expanded ? '220px' : '48px',
        transition: 'width 0.3s',
        overflow: 'hidden',
        minHeight: '100vh',
        background: '#f5f5f5',
        borderRight: '1px solid #ddd',
        position: 'relative',
        boxShadow: expanded ? '0 0 8px rgba(0,0,0,0.05)' : '0 0 4px rgba(0,0,0,0.08)'
      }}
    >
      <button
        style={{
          position: 'absolute',
          top: 10,
          right: expanded ? 10 : 'auto',
          left: expanded ? 'auto' : 10,
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          zIndex: 2,
          color: '#333',
          opacity: 1
        }}
        onClick={() => setExpanded(e => !e)}
        aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
      >
        {expanded ? '←' : '☰'}
      </button>
      <ul style={{ listStyle: 'none', padding: expanded ? '0' : '0', marginTop: expanded ? '3rem' : '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <li>
          <NavLink to="/backoffice/paroquias" activeclassname="active" style={{ display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 'bold', opacity: 1 }}>
            <Home size={22} style={{ marginRight: expanded ? '8px' : '0', verticalAlign: 'middle', color: '#222', opacity: 1 }} />
            {expanded && <span>Inserir Paróquia</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/backoffice/horarios" activeclassname="active" style={{ display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 'bold', opacity: 1 }}>
            <Calendar size={22} style={{ marginRight: expanded ? '8px' : '0', verticalAlign: 'middle', color: '#222', opacity: 1 }} />
            {expanded && <span>Inserir Horários</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/backoffice/eventos" activeclassname="active" style={{ display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 'bold', opacity: 1 }}>
            <PlusCircle size={22} style={{ marginRight: expanded ? '8px' : '0', verticalAlign: 'middle', color: '#222', opacity: 1 }} />
            {expanded && <span>Inserir Eventos</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
