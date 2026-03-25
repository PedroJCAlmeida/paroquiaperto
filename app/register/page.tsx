'use client';
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Bell, Mail } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import '@/styles/Login.css';

interface RegisterResponse {
  message: string;
  requiresEmailVerification?: boolean;
}

function RegistarUtilizadorForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post<RegisterResponse>('/api/auth/register', { name, email, password });
      if (response.status === 200 && response.data.requiresEmailVerification) {
        setRegisteredEmail(email);
      } else {
        setError('Erro ao registar utilizador.');
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      if (axiosErr.response?.data?.error) {
        setError(axiosErr.response.data.error);
      } else {
        setError('Ocorreu um erro ao tentar registar. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <div className="login-page">
        <div className="login-brand-panel">
          <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-brand-logo" />
          <h1 className="login-brand-name">Paróquia Perto</h1>
          <div className="login-brand-divider" />
          <p className="login-brand-tagline">Obrigado por se juntar a esta comunidade de fé.</p>
        </div>

        <div className="login-form-panel">
          <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-mobile-logo" />
          <div className="register-success-card">
            <div className="register-success-icon">
              <Mail size={34} />
            </div>
            <h2 className="register-success-title">Registo concluído</h2>
            <p className="register-success-text">Enviámos um e-mail de verificação para:</p>
            <p className="register-success-email">{registeredEmail}</p>
            <p className="register-success-text">
              Clique no link do e-mail para <strong>ativar a sua conta</strong> antes de iniciar sessão.
            </p>
            <p className="register-success-note">
              Nao encontrou o e-mail? Verifique as pastas de <strong>spam</strong> ou <strong>promocoes</strong>.
            </p>
            <Link href="/login" className="login-button register-success-button">
              Ir para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-brand-panel">
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-brand-logo" />
        <h1 className="login-brand-name">Paróquia Perto</h1>
        <div className="login-brand-divider" />
        <p className="login-brand-tagline">Crie a sua conta e ajude a fortalecer a vida paroquial local.</p>

        <div className="auth-brand-benefits">
          <div className="auth-brand-benefit">
            <MapPin size={16} className="auth-brand-icon" />
            <span>Registe paróquias e mantenha dados atualizados</span>
          </div>
          <div className="auth-brand-benefit">
            <Calendar size={16} className="auth-brand-icon" />
            <span>Divulgue eventos e atividades da comunidade</span>
          </div>
          <div className="auth-brand-benefit">
            <Bell size={16} className="auth-brand-icon" />
            <span>Receba notificações e novidades importantes</span>
          </div>
        </div>
      </div>

      <div className="login-form-panel">
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-mobile-logo" />
        <h2>Criar conta</h2>

        {loading && <p className="loading-message">A registar...</p>}
        {error && <p className="error-message">{error}</p>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
              placeholder="O seu nome completo"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="reg-email">E-mail</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="seu@email.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="reg-password">Palavra-passe</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Minimo 6 caracteres"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="reg-confirm-password">Confirmar palavra-passe</label>
            <input
              id="reg-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Repita a palavra-passe"
            />
          </div>
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'A Registar...' : 'Registar'}
          </button>
        </form>
        <p className="login-register-link">
          Ja tem conta? <Link href="/login">Faca login aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegistarUtilizador() {
  return (
    <Suspense fallback={<div className="login-page"><p className="loading-message">A carregar...</p></div>}>
      <RegistarUtilizadorForm />
    </Suspense>
  );
}


