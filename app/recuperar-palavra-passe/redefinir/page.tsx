'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { validatePassword, getPasswordValidationMessage } from '@/lib/validation';
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
      setError('Link de recuperacao inválido ou em falta.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As palavras-passe nao coincidem.');
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError(getPasswordValidationMessage(validation.errors));
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
    <div className="login-split-page reset-password-page">
      <div className="login-side-blue">
        <div className="brand-content">
          <img src="/logo_paroquia.png" alt="Paróquia Perto" className="brand-logo-large" />
          <h1 className="brand-title">Paróquia Perto</h1>
          <div className="brand-divider" />
          <p className="brand-tagline">
            Defina uma nova palavra-passe forte para proteger melhor a sua conta.
          </p>
        </div>
      </div>

      <div className="login-side-form">
        <div className="form-container-card">
          <div className="mobile-logo-header">
            <img src="/logo_paroquia.png" alt="Paróquia Perto" />
            <h3>Paróquia Perto</h3>
          </div>

          <h2 className="welcome-text">Redefinir Palavra-Passe</h2>
        {loading && <p className="loading-message">A guardar nova palavra-passe...</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        {!success && token && (
          <form onSubmit={handleSubmit} className="styled-login-form">
            <p className="recovery-instruction">Introduza e confirme a sua nova palavra-passe.</p>

            <div className="input-group">
              <label htmlFor="new-password">NOVA PALAVRA-PASSE</label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número"
              />
              {password && (
                <div className={`pwd-feedback ${validatePassword(password).isValid ? 'is-valid' : 'is-invalid'}`}>
                  {validatePassword(password).isValid ? (
                    <span className="pwd-status">Forte</span>
                  ) : (
                    <ul className="pwd-errors">
                      {validatePassword(password).errors.map((validationError, idx) => (
                        <li key={idx}>
                          {validationError}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">CONFIRMAR PALAVRA-PASSE</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Repita a palavra-passe"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'A guardar...' : 'Guardar nova palavra-passe'}
            </button>
          </form>
        )}

          <p className="footer-link-text">
            <Link href="/login">← Voltar ao login</Link>
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

export default function RedefinirPalavraPasse() {
  return (
    <Suspense>
      <RedefinirForm />
    </Suspense>
  );
}

