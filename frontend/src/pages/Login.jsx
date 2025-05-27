// src/components/Login.js

import React, { useState } from 'react';
// import { GoogleLogin } from '@react-oauth/google'; // Removido por enquanto, como combinado
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Importa o logo (assumindo que está na mesma pasta ou similar à Navbar)
import logo from '../assets/logo.png'; // <--- Adicione esta linha

import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Tentando login com:', { email, password });

      // SIMULAÇÃO: Apenas para testar o fluxo frontend
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (email === 'teste@teste.com' && password === '123456') {
        console.log('Login simulado bem-sucedido!');
        navigate('/backoffice');
      } else {
        setError('Email ou palavra-passe inválidos. Tente: teste@teste.com / 123456');
      }

    } catch (err) {
      console.error('Erro durante o login:', err);
      setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Adicione o logo aqui, antes do título */}
      <div className="login-logo-wrapper"> {/* <--- Novo wrapper para estilização */}
        <img src={logo} alt="Paróquia Perto" className="login-logo" /> {/* <--- Imagem do logo */}
      </div>

      <h2>Entrar no Paróquia Perto</h2>

      {loading && <p className="loading-message">A iniciar sessão...</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Palavra-passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Palavra-passe"
          />
        </div>
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'A Entrar...' : 'Entrar'}
        </button>
      </form>

      <p>Ainda não tem conta? <Link to="/register">Registe-se aqui</Link></p>
      <p><Link to="/forgot-password">Esqueceu a sua palavra-passe?</Link></p>
    </div>
  );
};

export default Login;
