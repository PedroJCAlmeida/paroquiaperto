// src/components/Login.js

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // <--- Certifique-se de que está importado
import axios from 'axios'; // Se estiver a enviar o token para o backend

import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate(); // <--- Instancie o hook
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSuccess = async (credentialResponse) => { // Tornar assíncrona se for chamar o backend
    setLoading(true);
    setError(null);

    try {
      const googleToken = credentialResponse.credential;
      console.log('Token JWT:', googleToken);

      // PASSO CRUCIAL: Enviar o token para o backend
      // Certifique-se que o URL está correto e que o backend está a processar isto
      const backendResponse = await axios.post('http://localhost:8080/api/auth/google', {
        token: googleToken
      });
      console.log('Resposta do Backend:', backendResponse.data);

      // Se o backend retornar um token de sessão, salve-o (ex: no localStorage)
      // localStorage.setItem('authToken', backendResponse.data.authToken);

      // Redireciona após login com o backend
      navigate('/backoffice'); // <--- Use navigate aqui para uma transição suave

    } catch (err) {
      console.error('Erro no login com Google ou backend:', err);
      setError('Falha no login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    console.error('Erro no login com Google (frontend)');
    setError('Não foi possível conectar com o Google.');
  };

  return (
    <div className="login-container">
      <h2>Entrar no Paróquia Perto</h2>
      {loading && <p className="loading-message">A iniciar sessão...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="google-login-button-wrapper">
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
};

export default Login;
