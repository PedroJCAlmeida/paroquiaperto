'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import '@/styles/Login.css';

interface AuthResponse {
  token: string;
  user: { id: number; name: string; email: string; role: string };
}

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const verified = searchParams.get('verified');

    if (verified === 'success') {
      setInfo('Conta confirmada com sucesso. Já pode iniciar sessão.');
      return;
    }

    if (verified === 'expired-token') {
      setInfo('O link de confirmação expirou. Registe-se novamente para receber novo e-mail.');
      return;
    }

    if (verified === 'missing-token' || verified === 'invalid-token') {
      setInfo('Link de confirmação inválido.');
      return;
    }

    if (verified === 'error') {
      setInfo('Não foi possível confirmar a conta. Tente novamente mais tarde.');
      return;
    }

    setInfo(null);
  }, [searchParams]);

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
        router.push('/buscar');
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
    <div className="login-split-page">
      {/* LADO ESQUERDO: BRANDING (AZUL) - Invisível no Mobile */}
      <div className="login-side-blue">
        <div className="brand-content">
          <img src="/logo_paroquia.png" alt="Logo" className="brand-logo-large" />
          <h1 className="brand-title">Paróquia Perto</h1>
          <div className="brand-divider" />
          <p className="brand-tagline">
            Horários de missa, eventos e informações sobre as paróquias mais próximas de si.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO (BRANCO) */}
      <div className="login-side-form">
        <div className="form-container-card">
          {/* Logo visível apenas no mobile */}
          <div className="mobile-logo-header">
            <img src="/logo_paroquia.png" alt="Logo" />
            <h3>Paróquia Perto</h3>
          </div>

          <h2 className="welcome-text">Bem-vindo de volta</h2>
          
          {info && <p className="success-message">{info}</p>}
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit} className="styled-login-form">
            <div className="input-group">
              <label htmlFor="email">E-MAIL</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">PALAVRA-PASSE</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="A sua palavra-passe"
              />
            </div>

            <div className="form-actions">
              <Link href="/recuperar-palavra-passe" className="forgot-link">
                Esqueci a palavra-passe
              </Link>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'A Entrar...' : 'Entrar'}
            </button>
          </form>

          <p className="footer-link-text">
            Ainda não tem conta? <Link href="/register">Registe-se aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const Login = () => (
  <Suspense fallback={<div className="login-container"><p className="loading-message">A carregar...</p></div>}>
    <LoginForm />
  </Suspense>
);

export default Login;