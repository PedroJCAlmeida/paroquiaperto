import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // ajuste o caminho se necessário
import '../styles/Navbar.css';

const Navbar = () => (
  <header className="navbar">
    <div className="navbar-inner">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Paróquia Perto" />
      </Link>
      <nav className="navbar-nav">
        <Link to="/" className="navbar-link">Início</Link>
        <Link to="/paroquias" className="navbar-link">Paróquias</Link>
        <Link to="/buscar" className="navbar-link">Buscar</Link>
        <Link to="/contato" className="navbar-link">Contato</Link>
      </nav>
    </div>
  </header>
);

export default Navbar;
