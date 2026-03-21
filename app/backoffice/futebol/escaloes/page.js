'use client';
import React, { useState, useEffect } from 'react';
import RoleRoute from '@/components/RoleRoute';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';

export default function InserirEscalao() {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clubes, setClubes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const initialForm = { nome: '', clubeId: '', treinadorId: '', delegadoId: '', auxiliarId: '' };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/futebol/clubes')
      .then(res => res.json())
      .then(data => setClubes(Array.isArray(data) ? data : []))
      .catch(() => setClubes([]));

    fetch('/api/usuarios', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setUsuarios([]));
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/futebol/escaloes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          nome: form.nome,
          clubeId: form.clubeId,
          treinadorId: form.treinadorId || null,
          delegadoId: form.delegadoId || null,
          auxiliarId: form.auxiliarId || null,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao criar escalão: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao criar escalão');
      console.error(error);
    }
  };

  return (
    <RoleRoute role="coordenador_futebol">
      <div className="backoffice-page">
        <h2>Inserir Escalão</h2>
        <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Escalão criado!" message="O escalão foi inserido com sucesso." />
        <Toast show={showToast} type="success" message="Escalão criado com sucesso!" onClose={() => setShowToast(false)} />
        <form className="backoffice-form" onSubmit={handleSubmit}>
          <section className="bo-section">
            <h3>Dados do Escalão</h3>
            <label>
              Nome do Escalão
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                placeholder="Ex: Sub-15, Seniores"
              />
            </label>
            <label>
              Clube
              <select name="clubeId" value={form.clubeId} onChange={handleChange} required>
                <option value="">Selecione um clube</option>
                {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </label>
          </section>
          <section className="bo-section">
            <h3 className="bo-h3-purple">Equipa Técnica</h3>
            <label>
              Treinador
              <select name="treinadorId" value={form.treinadorId} onChange={handleChange}>
                <option value="">Selecione um treinador</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </label>
            <label>
              Delegado
              <select name="delegadoId" value={form.delegadoId} onChange={handleChange}>
                <option value="">Selecione um delegado</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </label>
            <label>
              Auxiliar
              <select name="auxiliarId" value={form.auxiliarId} onChange={handleChange}>
                <option value="">Selecione um auxiliar (opcional)</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </label>
          </section>
          <button type="submit">Salvar Escalão</button>
        </form>
      </div>
    </RoleRoute>
  );
}
