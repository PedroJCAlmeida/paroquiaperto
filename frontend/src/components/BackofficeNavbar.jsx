import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

export default function BackofficeNavbar() {
  return (
    <header className="navbar" style={{ marginBottom: '2rem' }}>
      <div className="navbar-inner">
        <nav className="navbar-nav" style={{ justifyContent: 'center' }}>
          <NavLink to="/backoffice/paroquias" className="navbar-link">Inserir Paróquia</NavLink>
          <NavLink to="/backoffice/horarios" className="navbar-link">Inserir Horários</NavLink>
          <NavLink to="/backoffice/eventos" className="navbar-link">Inserir Eventos</NavLink>
        </nav>
      </div>
    </header>
  );
}
