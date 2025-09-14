// BackofficeMenu.jsx
import React, { useState } from 'react';
import { Home, Calendar, PlusCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import '../styles/BackofficeMenu.css';

export default function BackofficeMenu() {
  const [expanded, setExpanded] = useState(window.innerWidth > 700);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
      if (window.innerWidth > 700) setExpanded(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fecha menu ao clicar em item no mobile
  const handleNavClick = () => {
    if (isMobile) setExpanded(false);
  };


    return (
      <>
        {isMobile && (
          <button
            style={{
              position: 'fixed',
              top: 16,
              left: 16,
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '50%',
              width: 44,
              height: 44,
              fontSize: '2rem',
              cursor: 'pointer',
              zIndex: 1001,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onClick={() => setExpanded(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
        )}
        <nav
          className={`backoffice-menu${expanded ? ' expanded' : ' collapsed'}${isMobile ? ' mobile' : ''}`}
          style={{
            width: expanded ? (isMobile ? '80vw' : '220px') : (isMobile ? '0' : '48px'),
            maxWidth: isMobile ? '320px' : '220px',
            minWidth: isMobile ? '0' : '48px',
            transition: 'width 0.3s',
            overflow: 'hidden',
            minHeight: '100vh',
            background: '#f5f5f5',
            borderRight: '1px solid #ddd',
            position: isMobile ? 'fixed' : 'relative',
            top: 0,
            left: 0,
            zIndex: isMobile ? 1000 : 1,
            boxShadow: expanded ? '0 0 16px rgba(0,0,0,0.12)' : '0 0 4px rgba(0,0,0,0.08)'
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
            {expanded ? (isMobile ? '✕' : '←') : '☰'}
          </button>
          <ul style={{
            listStyle: 'none',
            padding: expanded ? (isMobile ? '2rem 0 0 0' : '0') : '0',
            marginTop: expanded ? (isMobile ? '0' : '3rem') : (isMobile ? '0' : '3rem'),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '2rem' : '1.5rem',
          }}>
            <li>
              <NavLink to="/backoffice/paroquias" activeclassname="active" style={{ display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 'bold', fontSize: isMobile ? '1.3rem' : '1rem', padding: isMobile ? '1rem 2rem' : '0.5rem 0', width: '100%' }} onClick={handleNavClick}>
                <Home size={isMobile ? 28 : 22} style={{ marginRight: expanded ? '12px' : '0', verticalAlign: 'middle', color: '#222' }} />
                {expanded && <span>Inserir Paróquia</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/backoffice/horarios" activeclassname="active" style={{ display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 'bold', fontSize: isMobile ? '1.3rem' : '1rem', padding: isMobile ? '1rem 2rem' : '0.5rem 0', width: '100%' }} onClick={handleNavClick}>
                <Calendar size={isMobile ? 28 : 22} style={{ marginRight: expanded ? '12px' : '0', verticalAlign: 'middle', color: '#222' }} />
                {expanded && <span>Inserir Horários</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/backoffice/eventos" activeclassname="active" style={{ display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 'bold', fontSize: isMobile ? '1.3rem' : '1rem', padding: isMobile ? '1rem 2rem' : '0.5rem 0', width: '100%' }} onClick={handleNavClick}>
                <PlusCircle size={isMobile ? 28 : 22} style={{ marginRight: expanded ? '12px' : '0', verticalAlign: 'middle', color: '#222' }} />
                {expanded && <span>Inserir Eventos</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </>
    );
}
