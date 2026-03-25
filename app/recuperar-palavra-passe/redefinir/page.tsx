'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import '@/styles/Login.css';

function RedefinirForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Link de recuperação inválido ou em falta.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/redefinir', { token, password });
      setSuccess('Palavra-passe alterada com sucesso! A redirecionar para o login...');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      setError(axiosErr.response?.data?.error ?? 'Erro ao redefinir palavra-passe. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo-wrapper">
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-logo" />
      </div>
      <h2>Redefinir Palavra-Passe</h2>
      {loading && <p className="loading-message">A guardar nova palavra-passe...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {!success && token && (
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
            Nova Palavra-Passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
            Confirmar Nova Palavra-Passe
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
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
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg,#1E40AF 0%,#3B82F6 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.08rem',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 0',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'A guardar...' : 'Guardar nova palavra-passe'}
          </button>
        </form>
      )}
      <p>
        <Link href="/login">← Voltar ao login</Link>
      </p>
    </div>
  );
}

export default function RedefinirPalavraPasse() {
  return (
    <Suspense>
      <RedefinirForm />
    </Suspense>
  );
}
