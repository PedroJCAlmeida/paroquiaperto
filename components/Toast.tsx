'use client';
import React from 'react';

interface ToastProps {
  show: boolean;
  type?: 'success' | 'error';
  message?: string;
  onClose: () => void;
}

export default function Toast({ show, type = 'success', message = '', onClose }: ToastProps) {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: type === 'success' ? '#4caf50' : '#f44336',
        color: '#fff',
        padding: '1rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 9999,
        fontWeight: 'bold',
        minWidth: '200px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <span>{message}</span>
      <button
        style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
