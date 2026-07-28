'use client';
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Bell, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { validatePassword, getPasswordValidationMessage } from '@/lib/validation';
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

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError(getPasswordValidationMessage(validation.errors));
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
      setError(axiosErr.response?.data?.error ?? 'Ocorreu um erro ao tentar registar.');
    } finally {
      setLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <div className="login-split-page">
        <div className="login-side-blue">
          <div className="brand-content">
            <img src="/logo_paroquia.png" alt="Logo" className="brand-logo-large" />
            <h1 className="brand-title">Bem-vindo!</h1>
            <div className="brand-divider" />
            <p className="brand-tagline">Obrigado por se juntar a esta comunidade de fé.</p>
          </div>
        </div>
        <div className="login-side-form">
          <div className="form-container-card success-card-anim">
            <div className="register-success-icon-wrapper">
              <Mail size={48} className="icon-mail-anim" />
            </div>
            <h2 className="welcome-text" style={{ textAlign: 'center' }}>Verifique o seu e-mail</h2>
            <p className="success-instruction">
              Enviámos um link de ativação para <strong>{registeredEmail}</strong>. 
              Por favor, clique no link para validar a sua conta.
            </p>
            <div className="brand-divider" style={{ margin: '20px auto' }} />
            <Link href="/login" className="submit-btn" style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}>
              Ir para o Login
            </Link>

            <div className="auth-quick-links" aria-label="Navegação rápida de autenticação">
              <Link href="/">Início</Link>
              <span>·</span>
              <Link href="/login">Entrar</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-split-page">
      {/* LADO ESQUERDO: BRANDING E BENEFÍCIOS */}
      <div className="login-side-blue">
        <div className="brand-content">
          <img src="/logo_paroquia.png" alt="Logo" className="brand-logo-large" />
          <h1 className="brand-title">Paróquia Perto</h1>
          <div className="brand-divider" />
          <p className="brand-tagline">Crie a sua conta e ajude a fortalecer a vida paroquial local.</p>

          <div className="auth-brand-benefits">
            <div className="benefit-item">
              <MapPin size={20} className="benefit-icon" />
              <span>Registe paróquias e mantenha dados atualizados</span>
            </div>
            <div className="benefit-item">
              <Calendar size={20} className="benefit-icon" />
              <span>Divulgue eventos e atividades da comunidade</span>
            </div>
            <div className="benefit-item">
              <Bell size={20} className="benefit-icon" />
              <span>Receba notificações e novidades importantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO */}
      <div className="login-side-form">
        <div className="form-container-card">
          <div className="mobile-logo-header">
            <img src="/logo_paroquia.png" alt="Logo" />
            <h3>Paróquia Perto</h3>
          </div>

          <h2 className="welcome-text">Criar conta</h2>
          
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit} className="styled-login-form">
            <div className="input-group">
              <label htmlFor="nome">NOME COMPLETO</label>
              <input
                id="nome"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="O seu nome"
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">E-MAIL</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">PALAVRA-PASSE</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"
              />
              {password && (
                <div className={`pwd-feedback ${validatePassword(password).isValid ? 'is-valid' : 'is-invalid'}`}>
                  {validatePassword(password).isValid ? (
                    <span className="pwd-status"><CheckCircle2 size={14} /> Forte</span>
                  ) : (
                    <ul className="pwd-errors">
                      {validatePassword(password).errors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="reg-confirm-password">CONFIRMAR PALAVRA-PASSE</label>
              <input
                id="reg-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repita a palavra-passe"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Registar'}
            </button>
          </form>

          <p className="footer-link-text">
            Já tem conta? <Link href="/login">Faça login aqui</Link>
          </p>

          <div className="auth-quick-links" aria-label="Navegação rápida de autenticação">
            <Link href="/">Início</Link>
            <span>·</span>
            <Link href="/login">Entrar</Link>
            <span>·</span>
            <Link href="/recuperar-palavra-passe">Recuperar palavra-passe</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistarUtilizador() {
  return (
    <Suspense fallback={<div className="login-split-page"><p className="loading-message">A carregar...</p></div>}>
      <RegistarUtilizadorForm />
    </Suspense>
  );
}