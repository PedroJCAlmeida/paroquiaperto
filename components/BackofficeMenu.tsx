'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Calendar, CalendarDays, List, PlusCircle, ChevronLeft, Menu, X, Users } from 'lucide-react';
import '@/styles/BackofficeMenu.css';
import { isAdminRole } from '@/lib/roles';

export default function BackofficeMenu() {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 700;
      setIsMobile(mobile);
      if (!mobile) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
  }, []);

  const handleNavClick = () => {
    if (isMobile) setExpanded(false);
  };

  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {isMobile && expanded && (
        <div className="backoffice-menu-overlay" onClick={() => setExpanded(false)} aria-hidden="true" />
      )}
      
      {isMobile && !expanded && (
        <button className="bo-mobile-open-btn" onClick={toggleMenu} aria-label="Abrir menu">
          <Menu size={24} />
        </button>
      )}

      <nav className={`backoffice-menu ${expanded ? 'expanded' : 'collapsed'} ${isMobile ? 'mobile' : ''}`}>
        <button className="menu-toggle-btn" onClick={toggleMenu} aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}>
          {isMobile ? (expanded ? <X size={24} /> : <Menu size={24} />) : (expanded ? <ChevronLeft size={20} /> : <Menu size={20} />)}
        </button>

        <ul className="menu-list">
          <li className="menu-item">
            <Link href="/backoffice" className="menu-link" onClick={handleNavClick}>
              <LayoutDashboard size={22} className="menu-icon" />
              {expanded && <span className="menu-text">Dashboard</span>}
            </Link>
          </li>

          <li className="menu-section-label">{expanded ? 'Paróquias' : 'P'}</li>
          <li className="menu-item">
            <Link href="/backoffice/paroquias" className="menu-link" onClick={handleNavClick}>
              <PlusCircle size={22} className="menu-icon" />
              {expanded && <span className="menu-text">Inserir Paróquia</span>}
            </Link>
          </li>
          <li className="menu-item">
            <Link href="/backoffice/paroquias/listar" className="menu-link" onClick={handleNavClick}>
              <List size={22} className="menu-icon" />
              {expanded && <span className="menu-text">Listar Paróquias</span>}
            </Link>
          </li>

          <li className="menu-section-label">{expanded ? 'Horários' : 'H'}</li>
          <li className="menu-item">
            <Link href="/backoffice/horarios" className="menu-link" onClick={handleNavClick}>
              <PlusCircle size={22} className="menu-icon" />
              {expanded && <span className="menu-text">Inserir Horário</span>}
            </Link>
          </li>
          <li>
            <Link href="/backoffice/horarios/listar" className="menu-link" onClick={handleNavClick}>
              <Calendar size={22} className="menu-icon" />
              {expanded && <span className="menu-text">Listar Horários</span>}
            </Link>
          </li>

          <li className="menu-section-label">{expanded ? 'Eventos' : 'E'}</li>
          <li className="menu-item">
            <Link href="/backoffice/eventos" className="menu-link" onClick={handleNavClick}>
              <PlusCircle size={22} className="menu-icon" />
              {expanded && <span className="menu-text">Inserir Evento</span>}
            </Link>
          </li>
          <li className="menu-item">
            <Link href="/backoffice/eventos/listar" className="menu-link" onClick={handleNavClick}>
              <CalendarDays size={22} className="menu-icon" />
              {expanded && <span className="menu-text">Listar Eventos</span>}
            </Link>
          </li>

          {isAdminRole(userRole) && (
            <>
              <li className="menu-section-label">{expanded ? 'Utilizadores' : 'U'}</li>
              <li className="menu-item">
                <Link href="/backoffice/utilizadores/listar" className="menu-link" onClick={handleNavClick}>
                  <Users size={22} className="menu-icon" />
                  {expanded && <span className="menu-text">Listar Utilizadores</span>}
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
