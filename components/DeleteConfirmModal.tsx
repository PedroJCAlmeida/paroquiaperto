'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  title,
  message,
  confirmLabel = 'Remover',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="modal-content" style={{
        background: 'var(--bg-card, #fff)',
        padding: '2.5rem',
        borderRadius: '20px',
        maxWidth: '450px',
        width: '90%',
        textAlign: 'center',
        border: '1px solid var(--border-color, #e2e8f0)'
      }}>
        <div style={{ color: '#e11d48', marginBottom: '1.5rem' }}><Trash2 size={56} style={{ margin: '0 auto' }} /></div>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main, #1e293b)', marginBottom: '1rem' }}>{title}</h3>
        <div style={{ color: 'var(--text-sub, #64748b)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>{message}</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onConfirm} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#e11d48', color: 'white', fontWeight: '700', cursor: 'pointer' }}>{confirmLabel}</button>
          <button onClick={onCancel} style={{
            flex: 1,
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid var(--border-color, #e2e8f0)',
            background: 'transparent',
            color: 'var(--text-sub, #64748b)',
            fontWeight: '700',
            cursor: 'pointer'
          }}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
}