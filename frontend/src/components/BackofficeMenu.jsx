// BackofficeMenu.jsx
import React, { useState } from 'react';
import { Home, Calendar, PlusCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import '../styles/BackofficeMenu.css';

export default function BackofficeMenu() {
  const [expanded, setExpanded] = useState(true);
  return (
    <nav className={`backoffice-menu${expanded ? ' expanded' : ' collapsed'}`} style={{
      width: expanded ? '220px' : '60px',
      transition: 'width 0.3s',
      overflow: 'hidden',
      minHeight: '100vh',
      background: '#f5f5f5',
      borderRight: '1px solid #ddd',
      position: 'relative'
    }}>
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
          zIndex: 2
        }}
        onClick={() => setExpanded(e => !e)}
        aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
      >
        {expanded ? '←' : '☰'}
      </button>
      {expanded && (
        <>
          <h3 style={{ marginTop: '2.5rem' }}>Área Administrativa</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <NavLink to="/backoffice/paroquias" activeclassname="active">
                <Home size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Inserir Paróquia
              </NavLink>
            </li>
            <li>
              <NavLink to="/backoffice/horarios" activeclassname="active">
                <Calendar size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Inserir Horários
              </NavLink>
            </li>
            <li>
              <NavLink to="/backoffice/eventos" activeclassname="active">
                <PlusCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Inserir Eventos
              </NavLink>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
}
