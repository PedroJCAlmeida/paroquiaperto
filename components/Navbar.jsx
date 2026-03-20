'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import '@/styles/Navbar.css';

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

  React.useEffect(() => {
    const checkAuth = () => setIsLoggedIn(Boolean(localStorage.getItem('token')));
    window.addEventListener('storage', checkAuth);
    checkAuth();
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <Image src="/logo.png" alt="Paróquia Perto" width={120} height={40} priority />
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
                  <Link href="/backoffice/paroquias" className="navbar-link" style={{ display: 'block', padding: '10px 16px' }} onClick={() => { setShowBackofficeMenu(false); setIsOpen(false); }}>Inserir Paróquia</Link>
                  <Link href="/backoffice/horarios" className="navbar-link" style={{ display: 'block', padding: '10px 16px' }} onClick={() => { setShowBackofficeMenu(false); setIsOpen(false); }}>Inserir Horários</Link>
                  <Link href="/backoffice/eventos" className="navbar-link" style={{ display: 'block', padding: '10px 16px' }} onClick={() => { setShowBackofficeMenu(false); setIsOpen(false); }}>Inserir Eventos</Link>
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
                    href="/usuario"
                    style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#333', textDecoration: 'none' }}
                    onClick={() => { setShowProfileMenu(false); setIsOpen(false); }}
                  >Configurações</Link>
                  <button
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
