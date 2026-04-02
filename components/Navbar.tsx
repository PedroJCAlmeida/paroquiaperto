'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import '@/styles/Navbar.css'; // Garante que o CSS está importado aqui

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBackofficeMenu, setShowBackofficeMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isLandingPage = pathname === '/'; // Verifica se é a landing page
  
  // Sincronização de Autenticação
  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(Boolean(localStorage.getItem('token')));
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
        setShowBackofficeMenu(false);
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    router.push('/login');
  };

  const closeAllMenus = () => {
    setIsOpen(false);
    setShowProfileMenu(false);
    setShowBackofficeMenu(false);
  };

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-inner">
        {/* Logo Section */}
        <Link href="/" className="navbar-logo" onClick={closeAllMenus}>
          <div className="navbar-logo-mark">
            <Image src="/logo_paroquia.png" alt="Logo" width={38} height={38} priority />
          </div>
          <span className="navbar-logo-text">Paróquia Perto</span>
        </Link>

        {/* Mobile Toggle */}
        <button 
          className={`navbar-toggle ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        {/* Nav Links */}
        <nav className={`navbar-nav ${isOpen ? 'active' : ''}`}>
         {isLandingPage ? (
            /* Links apenas para a Landing Page */
            <>
              <Link href="#como-funciona" className="navbar-link" onClick={closeAllMenus}>Como Funciona</Link>
              <Link href="#recursos" className="navbar-link" onClick={closeAllMenus}>Recursos</Link>
              <Link href="#faq" className="navbar-link" onClick={closeAllMenus}>FAQ</Link>
            </>
          ) : (
            /* Links para o resto do sistema */
            <>
              <Link href="/" className="navbar-link" onClick={closeAllMenus}>Início</Link>
              <Link href="/paroquias" className="navbar-link" onClick={closeAllMenus}>Paróquias</Link>
              <Link href="/buscar" className="navbar-link" onClick={closeAllMenus}>Buscar</Link>
              <Link href="/contacto" className="navbar-link" onClick={closeAllMenus}>Contacto</Link>
            </>
          )}

          {/* Dropdown Backoffice */}
          {isLoggedIn && (
            <div className="navbar-dropdown-wrapper">
              <button 
                className="navbar-link dropdown-trigger"
                onClick={() => setShowBackofficeMenu(!showBackofficeMenu)}
              >
                Backoffice <FaChevronDown size={10} className={showBackofficeMenu ? 'rotate' : ''} />
              </button>
              {showBackofficeMenu && (
                <div className="navbar-dropdown-menu">
                  <Link href="/backoffice/paroquias" onClick={closeAllMenus}>Inserir Paróquia</Link>
                  <Link href="/backoffice/horarios" onClick={closeAllMenus}>Inserir Horários</Link>
                  <Link href="/backoffice/eventos" onClick={closeAllMenus}>Inserir Eventos</Link>
                </div>
              )}
            </div>
          )}

          <div className="navbar-actions">
            <ThemeToggle />
            
            {/* Profile Dropdown */}
            {isLoggedIn ? (
              <div className="navbar-dropdown-wrapper profile">
                <button 
                  className="navbar-profile-trigger" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <FaUserCircle size={28} />
                </button>
                {showProfileMenu && (
                  <div className="navbar-dropdown-menu right">
                    <Link href="/usuario" onClick={closeAllMenus}>Configurações</Link>
                    <button onClick={handleLogout} className="logout-btn">Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="navbar-login-link" onClick={closeAllMenus}>
                <FaUserCircle size={28} />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
