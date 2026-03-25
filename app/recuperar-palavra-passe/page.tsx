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
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Introduza o seu e-mail e enviaremos um link para redefinir a sua palavra-passe.
          </p>
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
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
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

