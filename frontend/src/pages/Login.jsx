// src/components/Login.js

import React, { useState } from 'react';
// Removemos a importação do GoogleLogin por enquanto
import { useNavigate, Link } from 'react-router-dom'; // Mantemos useNavigate e Link
import axios from 'axios'; // Mantemos axios se for simular uma chamada para o backend

import '../styles/Login.css'; // Mantenha seu arquivo de estilos

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página
    setLoading(true);
    setError(null);

    // --- Simulação de Login (Substituir pela chamada real ao backend depois) ---
    try {
      console.log('Tentando login com:', { email, password });

      // **AQUI VOCÊ FARIA A CHAMADA AXIOS REAL PARA SEU BACKEND**
      // Exemplo:
      /*
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      if (response.data.success) { // Supondo que seu backend retorna { success: true, authToken: '...' }
        localStorage.setItem('authToken', response.data.authToken);
        navigate('/backoffice');
      } else {
        setError('Email ou palavra-passe inválidos.');
      }
      */

      // --- SIMULAÇÃO: Apenas para testar o fluxo frontend ---
      // Atraso para simular uma chamada de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (email === 'teste@teste.com' && password === '123456') { // Credenciais de teste
        console.log('Login simulado bem-sucedido!');
        navigate('/backoffice'); // Redireciona para o backoffice
      } else {
        setError('Email ou palavra-passe inválidos. Tente: teste@teste.com / 123456');
      }

    } catch (err) {
      console.error('Erro durante o login:', err);
      // Aqui você pode verificar o erro do backend e exibir uma mensagem mais específica
      setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className="login-container">
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

      {/* Links opcionais */}
      <p>Ainda não tem conta? <Link to="/register">Registe-se aqui</Link></p>
      <p><Link to="/forgot-password">Esqueceu a sua palavra-passe?</Link></p>

      {/* Pode manter o botão do Google Login comentado para reativar depois */}
      {/*
      <div className="google-login-button-wrapper">
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
      */}
    </div>
  );
};

export default Login;
