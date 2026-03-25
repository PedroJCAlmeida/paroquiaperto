'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('token'));
    }
    return false;
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBackofficeMenu, setShowBackofficeMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    const checkAuth = () => setIsLoggedIn(Boolean(localStorage.getItem('token')));
    window.addEventListener('storage', checkAuth);
    checkAuth();
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
        setShowBackofficeMenu(false);
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsOpen((v) => !v);

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <span className="navbar-logo-mark" aria-hidden="true">
            <Image src="/logo_paroquia.png" alt="" width={44} height={44} priority />
          </span>
          <span className="navbar-logo-text">Paróquia Perto</span>
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
          <Link href="/" className="navbar-link" onClick={() => setIsOpen(false)}>Início</Link>
          <Link href="/paroquias" className="navbar-link" onClick={() => setIsOpen(false)}>Paróquias</Link>
          <Link href="/buscar" className="navbar-link" onClick={() => setIsOpen(false)}>Buscar</Link>
          <Link href="/contato" className="navbar-link" onClick={() => setIsOpen(false)}>Contato</Link>
          {isLoggedIn && (
            <div
              className="navbar-link navbar-backoffice-dropdown"
              style={{ position: 'relative', display: 'inline-block' }}
              onClick={() => setShowBackofficeMenu((v) => !v)}
            >
              Backoffice <span aria-hidden="true">▾</span>
              {showBackofficeMenu && (
                <div
                  className="navbar-backoffice-menu"
                  style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '4px', minWidth: '180px', zIndex: 1000 }}
                >
                  <Link href="/backoffice/paroquias" className="navbar-link" style={{ display: 'block', padding: '10px 16px' }} onClick={() => { setShowBackofficeMenu(false); setIsOpen(false); }}>Inserir Paróquia</Link>
                  <Link href="/backoffice/horarios" className="navbar-link" style={{ display: 'block', padding: '10px 16px' }} onClick={() => { setShowBackofficeMenu(false); setIsOpen(false); }}>Inserir Horários</Link>
                  <Link href="/backoffice/eventos" className="navbar-link" style={{ display: 'block', padding: '10px 16px' }} onClick={() => { setShowBackofficeMenu(false); setIsOpen(false); }}>Inserir Eventos</Link>
                </div>
              )}
            </div>
          )}
          <ThemeToggle />
          {isLoggedIn ? (
            <div
              className="navbar-login-icon"
              style={{ position: 'relative', display: 'inline-block' }}
              onClick={() => setShowProfileMenu((v) => !v)}
              title="Perfil"
            >
              <FaUserCircle size={28} />
              {showProfileMenu && (
                <div className="navbar-profile-menu" style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '4px', minWidth: '140px', zIndex: 1000 }}>
                  <Link
                    href="/usuario"
                    className="navbar-profile-menu-item"
                    style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#333', textDecoration: 'none' }}
                    onClick={() => { setShowProfileMenu(false); setIsOpen(false); }}
                  >Configurações</Link>
                  <button
                    className="navbar-profile-menu-item"
                    style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#333' }}
                    onClick={() => {
                      localStorage.removeItem('token');
                      setIsLoggedIn(false);
                      router.push('/login');
                    }}
                  >Sair</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="navbar-login-icon" title="Login" onClick={() => setIsOpen(false)}>
              <FaUserCircle size={28} />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
