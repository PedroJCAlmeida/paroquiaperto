import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="Paróquia Perto" />
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        <nav className={`navbar-nav ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>Início</Link>
          <Link to="/paroquias" className="navbar-link" onClick={() => setIsOpen(false)}>Paróquias</Link>
          <Link to="/buscar" className="navbar-link" onClick={() => setIsOpen(false)}>Buscar</Link>
          <Link to="/contato" className="navbar-link" onClick={() => setIsOpen(false)}>Contato</Link>
          {/* Ícone de login */}
          <Link to="/login" className="navbar-link navbar-login-icon" onClick={() => setIsOpen(false)} title="Login">
            <FaUserCircle size={24} />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
