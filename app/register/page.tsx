'use client';
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Bell, Share2, Mail } from 'lucide-react';
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
      <div className="login-container">
        <div className="login-logo-wrapper">
          <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-logo" />
        </div>
        <div style={{
          maxWidth: 440,
          width: '100%',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 2px 24px rgba(0,0,0,0.10)',
          padding: '40px 28px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#f0fdf4',
            border: '2px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}>
            <Mail size={36} style={{ color: '#16a34a' }} />
          </div>
          <h2 style={{ color: '#243B55', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            Registo efetuado com sucesso!
          </h2>
          <p style={{ color: '#475569', margin: 0, lineHeight: 1.6 }}>
            Enviámos um e-mail de verificação para:
          </p>
          <p style={{
            background: '#f1f5f9',
            borderRadius: '8px',
            padding: '10px 18px',
            color: '#243B55',
            fontWeight: 700,
            fontSize: '1rem',
            margin: 0,
            wordBreak: 'break-all',
          }}>
            {registeredEmail}
          </p>
          <p style={{ color: '#475569', margin: 0, lineHeight: 1.6 }}>
            Por favor, clique no link no e-mail para <strong>ativar a sua conta</strong> antes de iniciar sessão.
          </p>
          <p style={{
            color: '#64748b',
            fontSize: '0.875rem',
            margin: 0,
            background: '#fefce8',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '10px 14px',
            lineHeight: 1.5,
          }}>
            💡 Não encontra o e-mail? Verifique a pasta de <strong>spam</strong> ou <strong>correio indesejado</strong>.
          </p>
          <Link
            href="/login"
            style={{
              marginTop: 8,
              display: 'inline-block',
              background: 'linear-gradient(135deg,#243B55 0%,#3E5C76 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.05rem',
              borderRadius: '10px',
              padding: '12px 32px',
              textDecoration: 'none',
            }}
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-logo-wrapper">
        <img src="/logo_paroquia.png" alt="Paróquia Perto" className="login-logo" />
      </div>
      <h2>Registar no Paróquia Perto</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto 24px'
      }}>
        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '12px',
          textAlign: 'center',
          fontSize: '0.8rem'
        }}>
          <MapPin size={20} style={{ margin: '0 auto 8px', color: '#243B55' }} />
          <strong style={{ color: '#243B55', display: 'block', marginBottom: '4px' }}>Registar Paróquia</strong>
          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Adicione sua paróquia à rede</span>
        </div>
        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <Calendar size={20} style={{ margin: '0 auto 8px', color: '#243B55' }} />
          <strong style={{ color: '#243B55', display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Criar Eventos</strong>
          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Publique eventos da comunidade</span>
        </div>
        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <Bell size={20} style={{ margin: '0 auto 8px', color: '#243B55' }} />
          <strong style={{ color: '#243B55', display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Notificações</strong>
          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Receba atualizações importantes</span>
        </div>
        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <Share2 size={20} style={{ margin: '0 auto 8px', color: '#243B55' }} />
          <strong style={{ color: '#243B55', display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Contribuir</strong>
          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Ajude a comunidade local</span>
        </div>
      </div>

      {loading && <p className="loading-message">A registar...</p>}
      {error && <p className="error-message">{error}</p>}
      <form
        className="register-form"
        onSubmit={handleSubmit}
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
          Nome
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
          />
        </label>
        <label style={{ fontWeight: 600, color: '#243B55', fontSize: '1.08rem' }}>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
          />
        </label>
        <label style={{ fontWeight: 600, color: '#243B55', fontSize: '1.08rem' }}>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
          />
        </label>
        <label style={{ fontWeight: 600, color: '#243B55', fontSize: '1.08rem' }}>
          Confirmar Senha
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
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
            cursor: 'pointer',
          }}
        >
          {loading ? 'A Registar...' : 'Registar'}
        </button>
      </form>
      <p>
        Já tem conta? <Link href="/login">Faça login aqui</Link>
      </p>
    </div>
  );
}

export default function RegistarUtilizador() {
  return (
    <Suspense fallback={<div className="login-container"><p className="loading-message">A carregar...</p></div>}>
      <RegistarUtilizadorForm />
    </Suspense>
  );
}


