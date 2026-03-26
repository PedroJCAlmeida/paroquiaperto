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
    <div className="login-page">
      <div className="login-brand-panel">
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-brand-logo" />
        <h1 className="login-brand-name">Paróquia Perto</h1>
        <div className="login-brand-divider" />
        <p className="login-brand-tagline">Defina uma nova palavra-passe forte para proteger melhor a sua conta.</p>
      </div>

      <div className="login-form-panel">
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-mobile-logo" />
        <h2>Redefinir Palavra-Passe</h2>
        {loading && <p className="loading-message">A guardar nova palavra-passe...</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        {!success && token && (
          <form onSubmit={handleSubmit} className="login-form recovery-form">
            <div className="form-field">
              <label className="form-label" htmlFor="new-password">Nova Palavra-Passe</label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Mínimo 8 caracteres, 1 maiúscula, 1 número"
              />
              {password && (
                <div className={`password-validation-feedback ${validatePassword(password).isValid ? 'valid' : 'invalid'}`}>
                  {validatePassword(password).isValid ? (
                    <div>✓ Palavra-passe forte</div>
                  ) : (
                    <div>
                      {validatePassword(password).errors.map((error, idx) => (
                        <div key={idx} className="password-requirement unmet">
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="confirm-password">Confirmar Palavra-Passe</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="form-input"
                placeholder="Repita a palavra-passe"
              />
            </div>
            <button type="submit" disabled={loading} className="login-button">
              {loading ? 'A guardar...' : 'Guardar nova palavra-passe'}
            </button>
          </form>
        )}
        <p className="login-register-link">
          <Link href="/login">← Voltar ao login</Link>
        </p>
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

