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

    <button className="navbar-toggle" onClick={toggleMenu} className={isOpen ? 'active navbar-toggle' : 'navbar-toggle'}>
      <span className="hamburger"></span>
      <span className="hamburger"></span>
      <span className="hamburger"></span>
    </button>

    <nav className={`navbar-nav ${isOpen ? 'active' : ''}`}>
      {/* links aqui */}
    </nav>

    {/* Ícone login fixo */}
    <Link to="/login" className="navbar-login-icon" title="Login" onClick={() => setIsOpen(false)}>
      <FaUserCircle size={24} />
    </Link>
  </div>
</header>

  );
};

export default Navbar;
