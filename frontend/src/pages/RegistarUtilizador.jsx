// src/components/Register.js (ou src/pages/Register.js)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Para futuras chamadas ao backend

import logo from '../assets/logo.png'; // Assume que o logo está no mesmo lugar
import '../styles/Login.css'; // Podemos reutilizar o mesmo CSS para estilos de formulário similares

const RegistarUtlizardor = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Para confirmar a palavra-passe
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Para mostrar mensagem de sucesso

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validação básica de campos
    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
        setError('A palavra-passe deve ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
    }

    try {
      console.log('Tentando registar com:', { name, email, password });

      // Chamada real ao backend
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${apiUrl}/register`, {
        name: name,
        email: email,
        password: password
    });

      if (response.data.success) { // Supondo que o backend retorna { success: true }
        setSuccess('Registo efetuado com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login'); // Redireciona para a página de login
        }, 2000); // Espera 2 segundos antes de redirecionar
      } else {
        setError(response.data.message || 'Erro ao registar utilizador.');
      }
     
    } catch (err) {
      console.error('Erro durante o registo:', err);
      // Aqui você pode verificar o erro do backend para mensagens mais específicas
      setError('Ocorreu um erro ao tentar registar. Por favor, tente novamente.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className="login-container"> {/* Reutilizamos o container para centralização */}
      <div className="login-logo-wrapper">
        <img src={logo} alt="Paróquia Perto" className="login-logo" />
      </div>

      <h2>Registar no Paróquia Perto</h2>

      {loading && <p className="loading-message">A registar...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>} {/* Mensagem de sucesso */}

      <form onSubmit={handleSubmit} className="login-form"> {/* Reutilizamos os estilos do formulário */}
        <form className="register-form" onSubmit={handleSubmit} style={{
          maxWidth: 400,
          margin: '0 auto',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          padding: '32px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}>
          <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>
            Nome
            <input type="text" name="nome" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
          </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>
          E-mail
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>
          Senha
          <input type="password" name="senha" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Palavra-passe:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-label="Confirmar Palavra-passe"
          />
        </div>
        <button type="submit" style={{
          background: 'linear-gradient(90deg,#2563eb 60%,#7c3aed 100%)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '1.08rem',
          border: 'none',
          borderRadius: '10px',
          padding: '12px 0',
          marginTop: '12px',
          boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}>Registrar</button>
      </form>

      <p>Já tem conta? <Link to="/login">Faça login aqui</Link></p>
    </div>
  );
};

export default RegistarUtlizardor;
