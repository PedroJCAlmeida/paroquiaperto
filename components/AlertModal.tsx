'use client';
import React from 'react';
import { AlertCircle, Info, CheckCircle } from 'lucide-react';

interface AlertModalProps {
  show: boolean;
  onClose: () => void;
  type?: 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
}

export default function AlertModal({
  show,
  onClose,
  type = 'error',
  title = 'Atenção',
  message = 'Ocorreu um problema.',
}: AlertModalProps) {
  if (!show) return null;

  const colors = {
    error: { bg: '#fee2e2', border: '#fecaca', icon: '#dc2626' },
    warning: { bg: '#fef3c7', border: '#fde68a', icon: '#d97706' },
    info: { bg: '#dbeafe', border: '#bfdbfe', icon: '#2563eb' },
  };

  const color = colors[type];

  const icons = {
    error: <AlertCircle size={32} color={color.icon} />,
    warning: <AlertCircle size={32} color={color.icon} />,
    info: <Info size={32} color={color.icon} />,
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderLeft: `4px solid ${color.icon}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
          maxWidth: '400px',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          {icons[type]}
        </div>
        <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>{title}</h3>
        <p style={{ marginBottom: '1.5rem', color: '#6b7280', lineHeight: '1.5' }}>{message}</p>
        <button
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '8px',
            background: color.icon,
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.opacity = '1';
          }}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
