'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Settings, 
  LogOut
} from 'lucide-react'; 
import ThemeToggle from './ThemeToggle';
import '@/styles/Navbar.css';
import { isAdminRole } from '@/lib/roles';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const isLandingPage = pathname === '/';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBackofficeMenu, setShowBackofficeMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('token')));
      setUserRole(localStorage.getItem('role'));
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeAllMenus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    closeAllMenus();
    router.push('/login');
  };

  const closeAllMenus = () => {
    setIsOpen(false);
    setShowProfileMenu(false);
    setShowBackofficeMenu(false);
  };

  const toggleBackoffice = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBackofficeMenu(!showBackofficeMenu);
    setShowProfileMenu(false);
  };

  const toggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProfileMenu(!showProfileMenu);
    setShowBackofficeMenu(false);
  };

  // Menu de Gestão unificado
  const AdminMenu = isLoggedIn && isAdminRole(userRole) && (
    <div className="navbar-dropdown-wrapper">
      <button
        type="button"
        className={`navbar-link dropdown-trigger admin-highlight ${showBackofficeMenu ? 'active' : ''}`}
        onClick={toggleBackoffice}
      >
        <span>Gestão</span>
        <FaChevronDown size={10} className={`icon-arrow ${showBackofficeMenu ? 'rotate' : ''}`} />
      </button>
      {showBackofficeMenu && (
        <div className="navbar-dropdown-menu admin-panel">
          <div className="dropdown-header">Administração</div>
          <Link href="/backoffice" className="dropdown-item" onClick={closeAllMenus}>
            <LayoutDashboard size={18} />
            <div className="item-info">
              <span className="item-title">Dashboard</span>
              <span className="item-desc">Visão geral do backoffice</span>
            </div>
          </Link>
          <Link href="/backoffice/paroquias" className="dropdown-item" onClick={closeAllMenus}>
            <LayoutDashboard size={18} />
            <div className="item-info">
              <span className="item-title">Paróquias</span>
              <span className="item-desc">Gerir listagem e dados</span>
            </div>
          </Link>
          <Link href="/backoffice/horarios" className="dropdown-item" onClick={closeAllMenus}>
            <Clock size={18} />
            <div className="item-info">
              <span className="item-title">Horários</span>
              <span className="item-desc">Missas e confissões</span>
            </div>
          </Link>
          <Link href="/backoffice/eventos" className="dropdown-item" onClick={closeAllMenus}>
            <Calendar size={18} />
            <div className="item-info">
              <span className="item-title">Eventos</span>
              <span className="item-desc">Agenda da comunidade</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <header 
      ref={navRef} 
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${isOpen ? 'mobile-active' : ''}`}
    >
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" onClick={closeAllMenus}>
          <div className="navbar-logo-mark">
            <Image src="/logo_paroquia.png" alt="Logo" width={38} height={38} priority />
          </div>
          <span className="navbar-logo-text">Paróquia Perto</span>
        </Link>

        <button className={`navbar-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        <nav className={`navbar-nav ${isOpen ? 'active' : ''}`}>
          <div className="navbar-nav-links">
            {isLandingPage ? (
              <>
                <Link href="#como-funciona" className="navbar-link" onClick={closeAllMenus}>Como Funciona</Link>
                <Link href="#recursos" className="navbar-link" onClick={closeAllMenus}>Recursos</Link>
                <Link href="#faq" className="navbar-link" onClick={closeAllMenus}>FAQ</Link>
                {AdminMenu}
              </>
            ) : (
              <>
                <Link href="/" className="navbar-link" onClick={closeAllMenus}>Início</Link>
                <Link href="/paroquias" className="navbar-link" onClick={closeAllMenus}>Paróquias</Link>
                <Link href="/buscar" className="navbar-link" onClick={closeAllMenus}>Buscar</Link>
                <Link href="/contacto" className="navbar-link" onClick={closeAllMenus}>Contacto</Link>
                {AdminMenu}
              </>
            )}
          </div>

          <div className="navbar-actions">
            <ThemeToggle />
            
            {isLoggedIn ? (
              <div className="navbar-dropdown-wrapper profile">
                {/* Botão sem o ícone UserCircle */}
                <button 
                  type="button"
                  className={`navbar-link dropdown-trigger ${showProfileMenu ? 'active' : ''}`} 
                  onClick={toggleProfile}
                >
                  <span>Minha Conta</span> 
                  <FaChevronDown size={10} className={`icon-arrow ${showProfileMenu ? 'rotate' : ''}`} />
                </button>
                {showProfileMenu && (
                  <div className="navbar-dropdown-menu right profile-panel">
                    <Link href="/utilizador" className="dropdown-item" onClick={closeAllMenus}>
                      <Settings size={16} /> Configurações
                    </Link>
                    <button type="button" onClick={handleLogout} className="logout-btn dropdown-item">
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns-container">
                <Link href="/login" className="navbar-link navbar-login-btn" onClick={closeAllMenus}>
                  Entrar
                </Link>
                <Link href="/register" className="navbar-register-btn" onClick={closeAllMenus}>
                  Registar
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;