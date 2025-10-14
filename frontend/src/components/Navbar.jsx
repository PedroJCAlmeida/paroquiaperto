import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [backofficeOpen, setBackofficeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Paróquia Perto" />
        </Link>

        {/* Hamburger */}
        <button
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        {/* Menu principal */}
        <ul className={`navbar-nav ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>Início</Link></li>
          <li><Link to="/paroquias" className="navbar-link" onClick={() => setMenuOpen(false)}>Paróquias</Link></li>
          <li><Link to="/contato" className="navbar-link" onClick={() => setMenuOpen(false)}>Contato</Link></li>

          {/* Backoffice com submenu */}
          {isLoggedIn && (
            <li
              className="navbar-backoffice-dropdown"
              onMouseEnter={() => setBackofficeOpen(true)}
              onMouseLeave={() => setBackofficeOpen(false)}
              onClick={() => setBackofficeOpen(!backofficeOpen)}
            >
              <span className="navbar-link">Backoffice</span>
              {backofficeOpen && (
                <ul className="navbar-submenu">
                  <li><Link to="/backoffice/paroquias" onClick={() => setMenuOpen(false)}>Inserir Paróquia</Link></li>
                  <li><Link to="/backoffice/horarios" onClick={() => setMenuOpen(false)}>Inserir Horários</Link></li>
                  <li><Link to="/backoffice/eventos" onClick={() => setMenuOpen(false)}>Inserir Eventos</Link></li>
                </ul>
              )}
            </li>
          )}

          {/* Perfil/Login */}
          <li
            className="navbar-login-icon"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <FaUserCircle size={28} />
            {isLoggedIn && profileOpen && (
              <ul className="navbar-submenu navbar-profile-menu">
                <li><Link to="/usuario" onClick={() => setMenuOpen(false)}>Configurações</Link></li>
                <li><button onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}>Sair</button></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
