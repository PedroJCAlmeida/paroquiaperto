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
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-logo" />
      </div>
      <h2>Entrar no Paróquia Perto</h2>
      {loading && <p className="loading-message">A iniciar sessão...</p>}
      {info && <p className="success-message">{info}</p>}
      {error && <p className="error-message">{error}</p>}
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
        <label style={{ fontWeight: 600, color: '#243B55', fontSize: '1.08rem' }}>
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
        <label style={{ fontWeight: 600, color: '#243B55', fontSize: '1.08rem' }}>
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
          <Link href="/recuperar-palavra-passe" style={{ fontSize: '0.9rem', color: '#243B55' }}>
            Esqueci a palavra-passe
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg,#243B55 0%,#3E5C76 100%)',
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

const Login = () => (
  <Suspense fallback={<div className="login-container"><p className="loading-message">A carregar...</p></div>}>
    <LoginForm />
  </Suspense>
);

export default Login;

