'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Se estiveres a usar Next.js, caso contrário usa 'react-router-dom'
import { usePathname } from 'next/navigation';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import '@/styles/Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBackofficeMenu, setShowBackofficeMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const pathname = usePathname();

  // Verifica login e tema no carregamento
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  // Fecha menus ao mudar de página
  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
    setShowBackofficeMenu(false);
  }, [pathname]);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* LOGO */}
        <Link href="/" className="navbar-logo">
          <span className="navbar-logo-text">Paróquia Perto</span>
        </Link>

        {/* HAMBURGER (Mobile) */}
        <button
          className={`navbar-toggle ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        {/* NAVIGATION */}
        <nav className={`navbar-nav ${isOpen ? 'active' : ''}`}>
          <div className="navbar-nav-links">
            <Link href="/" className="navbar-link">Início</Link>
            <Link href="/paroquias" className="navbar-link">Paróquias</Link>
            <Link href="/buscar" className="navbar-link">Buscar</Link>
            <Link href="/contacto" className="navbar-link">Contacto</Link>
            {/* BACKOFFICE DROPDOWN */}
            {isLoggedIn && (
              <div className="navbar-dropdown-wrapper">
                <button
                  className="navbar-link dropdown-trigger"
                  onClick={() => setShowBackofficeMenu(!showBackofficeMenu)}
                >
                  Backoffice <FaChevronDown size={10} />
                </button>
                {showBackofficeMenu && (
                  <div className="navbar-dropdown-menu">
                    <Link href="/backoffice/paroquias">Inserir Paróquia</Link>
                    <Link href="/backoffice/horarios">Inserir Horários</Link>
                    <Link href="/backoffice/eventos">Inserir Eventos</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ACTIONS (Tema e Login/Perfil) */}
          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Trocar Tema">
              {isDarkMode ? <MdOutlineLightMode size={22} /> : <MdOutlineDarkMode size={22} />}
            </button>

            {isLoggedIn ? (
              <div className="navbar-dropdown-wrapper profile">
                <button className="navbar-profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  <span>Minha Conta</span> <FaChevronDown size={12} />
                </button>
                {showProfileMenu && (
                  <div className="navbar-dropdown-menu right">
                    <Link href="/usuario">Configurações</Link>
                    <button onClick={handleLogout} className="logout-btn">Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="navbar-login-btn">Entrar</Link>
                <Link href="/register" className="navbar-register-btn">Registar</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;