'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface ParoquiaDeleteConfirmProps {
  nome?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ParoquiaDeleteConfirm({ nome, onConfirm, onCancel }: ParoquiaDeleteConfirmProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ color: '#e11d48', marginBottom: '1.5rem' }}><Trash2 size={56} style={{ margin: '0 auto' }} /></div>
        <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>Confirmar Remoção</h3>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Tem certeza que deseja remover a paróquia <strong>{nome}</strong>?</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onConfirm} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#e11d48', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Remover</button>
          <button onClick={onCancel} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}