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
        router.push('/descobrir');
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
    <div className="login-page">
      {/* Painel esquerdo: marca */}
      <div className="login-brand-panel">
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-brand-logo" />
        <h1 className="login-brand-name">Paróquia Perto</h1>
        <div className="login-brand-divider" />
        <p className="login-brand-tagline">Horários de missa, eventos e informações sobre as paróquias mais próximas de si.</p>
      </div>

      {/* Painel direito: formulário */}
      <div className="login-form-panel">
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-mobile-logo" />
        <h2>Bem-vindo de volta</h2>
        {loading && <p className="loading-message">A iniciar sessão...</p>}
        {info && <p className="success-message">{info}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="seu@email.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="password">Palavra-passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="A sua palavra-passe"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/recuperar-palavra-passe" style={{ fontSize: '0.85rem', color: '#1F2F46' }}>
              Esqueci a palavra-passe
            </Link>
          </div>
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'A Entrar...' : 'Entrar'}
          </button>
        </form>
        <p className="login-register-link">
          Ainda não tem conta? <Link href="/register">Registe-se aqui</Link>
        </p>
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

