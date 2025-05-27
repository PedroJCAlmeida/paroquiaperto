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
        </nav>

        <Link to="/login" className="navbar-login-icon" title="Login" onClick={() => setIsOpen(false)}>
          <FaUserCircle size={28} />
         </Link>
      </div>
    </header>
  );
};

export default Navbar;
