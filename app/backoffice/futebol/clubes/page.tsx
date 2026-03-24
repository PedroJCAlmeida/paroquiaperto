'use client';
import React, { useState } from 'react';
import RoleRoute from '@/components/RoleRoute';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';

export default function InserirClube() {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/futebol/clubes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao criar clube: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setNome('');
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao criar clube');
      console.error(error);
    }
  };

  return (
    <RoleRoute role="coordenador_futebol">
      <div className="backoffice-page">
        <h2>Inserir Clube</h2>
        <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Clube criado!" message="O clube foi inserido com sucesso." />
        <Toast show={showToast} type="success" message="Clube criado com sucesso!" onClose={() => setShowToast(false)} />
        <form className="backoffice-form" onSubmit={handleSubmit}>
          <section className="bo-section">
            <h3>Dados do Clube</h3>
            <label>
              Nome do Clube
              <input type="text" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex: Sporting CP" />
            </label>
          </section>
          <button type="submit">Salvar Clube</button>
        </form>
      </div>
    </RoleRoute>
  );
}
