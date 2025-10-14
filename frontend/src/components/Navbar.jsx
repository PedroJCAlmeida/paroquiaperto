import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'backoffice' | 'profile' | null
  const navRef = useRef(null);

  // Fecha o menu quando o usuário clica fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha o menu ao mudar de rota
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
      setOpenDropdown(null);
    };
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (name) =>
    setOpenDropdown(openDropdown === name ? null : name);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="Paróquia Perto" />
        </Link>

        {/* Botão Hamburguer */}
        <button
          className={`navbar-toggle ${isOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Abrir menu"
          aria-expanded={isOpen}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        {/* Menu principal */}
        <nav className={`navbar-nav ${isOpen ? 'active' : ''}`} role="menu">
          <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>Início</Link>
          <Link to="/paroquias" className="navbar-link" onClick={() => setIsOpen(false)}>Paróquias</Link>
          <Link to="/buscar" className="navbar-link" onClick={() => setIsOpen(false)}>Buscar</Link>
          <Link to="/contato" className="navbar-link" onClick={() => setIsOpen(false)}>Contato</Link>

          {/* Dropdown Backoffice */}
          {isLoggedIn && (
            <div
              className="navbar-dropdown"
              onClick={() => toggleDropdown('backoffice')}
              onMouseEnter={() => window.innerWidth > 900 && setOpenDropdown('backoffice')}
              onMouseLeave={() => window.innerWidth > 900 && setOpenDropdown(null)}
            >
              <span className="navbar-link dropdown-toggle">
                Backoffice
              </span>
              <div className={`dropdown-menu ${openDropdown === 'backoffice' ? 'show' : ''}`}>
                <Link to="/backoffice/paroquias" onClick={() => setOpenDropdown(null)}>Inserir Paróquia</Link>
                <Link to="/backoffice/horarios" onClick={() => setOpenDropdown(null)}>Inserir Horários</Link>
                <Link to="/backoffice/eventos" onClick={() => setOpenDropdown(null)}>Inserir Eventos</Link>
              </div>
            </div>
          )}

          {/* Dropdown Perfil / Login */}
          {isLoggedIn ? (
            <div
              className="navbar-dropdown navbar-profile"
              onClick={() => toggleDropdown('profile')}
              onMouseEnter={() => window.innerWidth > 900 && setOpenDropdown('profile')}
              onMouseLeave={() => window.innerWidth > 900 && setOpenDropdown(null)}
            >
              <FaUserCircle size={28} className="navbar-login-icon" />
              <div className={`dropdown-menu right ${openDropdown === 'profile' ? 'show' : ''}`}>
                <Link to="/usuario" onClick={() => setOpenDropdown(null)}>Configurações</Link>
                <button onClick={logout}>Sair</button>
              </div>
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
