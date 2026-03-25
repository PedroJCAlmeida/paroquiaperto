'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, Bell, Share2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import '@/styles/Login.css';

interface RegisterResponse {
  message: string;
  requiresEmailVerification?: boolean;
}

const RegistarUtilizador = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const message = searchParams.get('message');
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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
        setSuccess(response.data.message);
        setTimeout(() => router.push('/login'), 2000);
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

  return (
    <div className="login-container">
      <div className="login-logo-wrapper">
        <img src="/logo.png" alt="Paróquia Perto" className="login-logo" />
      </div>
      <h2>Registar no Paróquia Perto</h2>
      
      {message && (
        <div style={{ 
          background: 'linear-gradient(135deg, #DBEAFE 0%, #FCE7F3 100%)',
          border: '1px solid #BFDBFE',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#1E40AF',
          fontWeight: '600',
          fontSize: '0.95rem'
        }}>
          {message}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
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
          <MapPin size={20} style={{ margin: '0 auto 8px', color: '#1E40AF' }} />
          <strong style={{ color: '#1E40AF', display: 'block', marginBottom: '4px' }}>Registar Paróquia</strong>
          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Adicione sua paróquia à rede</span>
        </div>
        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <Calendar size={20} style={{ margin: '0 auto 8px', color: '#1E40AF' }} />
          <strong style={{ color: '#1E40AF', display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Criar Eventos</strong>
          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Publique eventos da comunidade</span>
        </div>
        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <Bell size={20} style={{ margin: '0 auto 8px', color: '#1E40AF' }} />
          <strong style={{ color: '#1E40AF', display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Notificações</strong>
          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Receba atualizações importantes</span>
        </div>
        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <Share2 size={20} style={{ margin: '0 auto 8px', color: '#1E40AF' }} />
          <strong style={{ color: '#1E40AF', display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Contribuir</strong>
          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Ajude a comunidade local</span>
        </div>
      </div>

      {loading && <p className="loading-message">A registar...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
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
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Nome
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
          />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
          />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
          />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
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
            background: 'linear-gradient(90deg,#2563eb 60%,#7c3aed 100%)',
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
};

export default RegistarUtilizador;
