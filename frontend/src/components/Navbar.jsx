import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBackofficeMenu, setShowBackofficeMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fecha menu ao mudar de rota
  React.useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
      setShowBackofficeMenu(false);
    };
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="Paróquia Perto" />
        </Link>
        <button
          className={isOpen ? 'active navbar-toggle' : 'navbar-toggle'}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
        <nav className={`navbar-nav ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>Início</Link>
          <Link to="/paroquias" className="navbar-link" onClick={() => setIsOpen(false)}>Paróquias</Link>
          <Link to="/buscar" className="navbar-link" onClick={() => setIsOpen(false)}>Buscar</Link>
          <Link to="/contato" className="navbar-link" onClick={() => setIsOpen(false)}>Contato</Link>
          {isLoggedIn && (
            <div
              className="navbar-link navbar-backoffice-dropdown"
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => setShowBackofficeMenu(true)}
              onMouseLeave={() => setShowBackofficeMenu(false)}
              onClick={() => setShowBackofficeMenu(v => !v)}
            >
              Backoffice
              {showBackofficeMenu && (
                <div
                  className="navbar-backoffice-menu"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderRadius: '4px',
                    minWidth: '180px',
                    zIndex: 1000,
                  }}
                >
                  <Link to="/backoffice/paroquias" className="navbar-link" style={{ display: 'block', padding: '10px 16px' }} onClick={() => { setShowBackofficeMenu(false); setIsOpen(false); }}>Inserir Paróquia</Link>
                  <Link to="/backoffice/horarios" className="navbar-link" style={{ display: 'block', padding: '10px 16px' }} onClick={() => { setShowBackofficeMenu(false); setIsOpen(false); }}>Inserir Horários</Link>
                  <Link to="/backoffice/eventos" className="navbar-link" style={{ display: 'block', padding: '10px 16px' }} onClick={() => { setShowBackofficeMenu(false); setIsOpen(false); }}>Inserir Eventos</Link>
                </div>
              )}
            </div>
          )}
          {isLoggedIn ? (
            <div
              className="navbar-login-icon"
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}
              onClick={() => setShowProfileMenu(v => !v)}
              title="Perfil"
            >
              <FaUserCircle size={28} />
              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderRadius: '4px',
                    minWidth: '140px',
                    zIndex: 1000,
                  }}
                >
                  <Link
                    to="/usuario"
                    style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#333', textDecoration: 'none' }}
                    onClick={() => { setShowProfileMenu(false); setIsOpen(false); }}
                  >Configurações</Link>
                  <button
                    style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#333' }}
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                  >Sair</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-login-icon" title="Login" onClick={() => setIsOpen(false)}>
              <FaUserCircle size={28} />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
