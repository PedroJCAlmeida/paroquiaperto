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

      // --- SIMULAÇÃO DE REGISTO (Substituir pela chamada real ao backend) ---
      // Aqui você faria a chamada axios.post para seu backend, ex:
      /*
      const response = await axios.post('http://localhost:8080/api/auth/register', {
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
      */

      // --- SIMULAÇÃO: Apenas para testar o fluxo frontend ---
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula atraso da rede

      setSuccess('Registo efetuado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login'); // Redireciona para a página de login
      }, 2000); // Espera 2 segundos antes de redirecionar

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
        <div className="form-group">
          <label htmlFor="name">Nome Completo:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Nome Completo"
          />
        </div>
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
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'A Registar...' : 'Registar'}
        </button>
      </form>

      <p>Já tem conta? <Link to="/login">Faça login aqui</Link></p>
    </div>
  );
};

export default RegistarUtlizardor;
