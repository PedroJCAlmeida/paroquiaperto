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
    <div className="login-container">
      <div className="login-logo-wrapper">
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-logo" />
      </div>
      <h2>Recuperar Palavra-Passe</h2>
      {loading && <p className="loading-message">A enviar pedido...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {!success && (
        <form onSubmit={handleSubmit} className="login-form">
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Introduza o seu e-mail e enviaremos um link para redefinir a sua palavra-passe.
          </p>
          <div className="form-field">
            <label className="form-label" htmlFor="recovery-email">E-mail</label>
            <input
              id="recovery-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="seu@email.com"
            />
          </div>
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'A enviar...' : 'Enviar link de recuperação'}
          </button>
        </form>
      )}
      <p>
        <Link href="/login">← Voltar ao login</Link>
      </p>
    </div>
  );
}

