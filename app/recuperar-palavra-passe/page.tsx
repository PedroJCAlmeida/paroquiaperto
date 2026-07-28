'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import '@/styles/Login.css';

export default function RecuperarPalavraPasse() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post('/api/auth/recuperar', { email });
      setSuccess('Se o e-mail estiver registado, irá receber um link de recuperação em breve.');
      setEmail('');
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      setError(axiosErr.response?.data?.error ?? 'Erro ao enviar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-page">
      {/* LADO ESQUERDO: BRANDING (AZUL) */}
      <div className="login-side-blue">
        <div className="brand-content">
          <img src="/logo_paroquia.png" alt="Logo" className="brand-logo-large" />
          <h1 className="brand-title">Paróquia Perto</h1>
          <div className="brand-divider" />
          <p className="brand-tagline">
            Redefina a sua palavra-passe de forma segura e rápida para recuperar o acesso à sua conta.
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

          <h2 className="welcome-text">Recuperar Palavra-Passe</h2>
          
          {loading && <p className="loading-message">A enviar pedido...</p>}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          {!success && (
            <form onSubmit={handleSubmit} className="styled-login-form">
              <p className="recovery-instruction">
                Introduza o seu e-mail e enviaremos um link para redefinir a sua palavra-passe.
              </p>
              
              <div className="input-group">
                <label htmlFor="recovery-email">E-MAIL</label>
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'A enviar...' : 'Enviar link de recuperação'}
              </button>
            </form>
          )}

          <p className="footer-link-text">
            <Link href="/login" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '600' }}>
              ← Voltar ao login
            </Link>
          </p>

          <div className="auth-quick-links" aria-label="Navegação rápida de autenticação">
            <Link href="/">Início</Link>
            <span>·</span>
            <Link href="/login">Entrar</Link>
            <span>·</span>
            <Link href="/register">Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}