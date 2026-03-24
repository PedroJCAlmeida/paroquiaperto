'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios, { AxiosError } from 'axios';
import '@/styles/Login.css';

interface AuthResponse {
  token: string;
  user: { id: number; name: string; email: string; role: string };
}

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<AuthResponse>('/api/auth/google', {
        token: credentialResponse.credential,
      });
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user?.role) {
          localStorage.setItem('role', response.data.user.role);
        }
        router.push('/');
      } else {
        setError('Falha na autenticação Google.');
      }
    } catch {
      setError('Erro ao autenticar com Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<AuthResponse>('/api/auth/login', { email, password });
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user?.role) {
          localStorage.setItem('role', response.data.user.role);
        }
        router.push('/');
      } else {
        setError('Email ou palavra-passe inválidos.');
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      if (axiosErr.response) {
        setError(axiosErr.response.data?.error ?? 'Erro ao tentar fazer login.');
      } else {
        setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo-wrapper">
        <img src="/logo.png" alt="Paróquia Perto" className="login-logo" />
      </div>
      <h2>Entrar no Paróquia Perto</h2>
      {loading && <p className="loading-message">A iniciar sessão...</p>}
      {error && <p className="error-message">{error}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError('Falha ao autenticar com Google.')}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="login-form"
        style={{
          maxWidth: 400,
          margin: '0 auto',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          padding: '32px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              marginTop: 4,
              fontSize: '1rem',
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              marginTop: 4,
              fontSize: '1rem',
            }}
          />
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/recuperar-palavra-passe" style={{ fontSize: '0.9rem', color: '#2563eb' }}>
            Esqueci a palavra-passe
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'linear-gradient(90deg,#2563eb 60%,#7c3aed 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.08rem',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 0',
            cursor: 'pointer',
          }}
        >
          {loading ? 'A Entrar...' : 'Entrar'}
        </button>
      </form>
      <p>
        Ainda não tem conta? <Link href="/register">Registe-se aqui</Link>
      </p>
    </div>
  );
};

export default Login;
