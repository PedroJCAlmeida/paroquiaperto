'use client';
import React from 'react';

export default function SuccessModal({ show, onClose, title = "Obrigado pela colaboração!", message = "Dados enviados com sucesso." }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
      }}>
        <img src="/logo.png" alt="Logo Paróquia Perto" style={{ width: '18vw', maxWidth: '160px', minWidth: '70px', marginBottom: '1rem' }} />
        <h3>{title}</h3>
        <p>{message}</p>
        <button style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', borderRadius: '8px', background: '#007bff', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
