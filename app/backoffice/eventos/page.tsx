'use client';
import React, { useState, useEffect } from 'react';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';
import type { Paroquia } from '@/types';

interface EventoForm {
  paroquiaId: string;
  titulo: string;
  data: string;
  hora: string;
  descricao: string;
  imagem: string;
}

export default function InserirEvento() {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const initialForm: EventoForm = { paroquiaId: '', titulo: '', data: '', hora: '', descricao: '', imagem: '' };
  const [form, setForm] = useState<EventoForm>(initialForm);

  useEffect(() => {
    fetch('/api/paroquias')
      .then((res) => res.json())
      .then((data: Paroquia[]) => setParoquias(data))
      .catch(() => setParoquias([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paroquiaId: form.paroquiaId, titulo: form.titulo, data: form.data, hora: form.hora, descricao: form.descricao, imagem: form.imagem }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao enviar evento: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao enviar evento');
      console.error(error);
    }
  };

  return (
    <div className="backoffice-page">
      <h2>Inserir Evento</h2>
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Obrigado pela colaboração!" message="Evento enviado com sucesso." />
      <Toast show={showToast} type="success" message="Evento enviado com sucesso!" onClose={() => setShowToast(false)} />
      <form className="backoffice-form" onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '32px 18px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Paróquia
          <select name="paroquiaId" value={form.paroquiaId} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }}>
            <option value="">Selecione uma paróquia</option>
            {paroquias.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Título do Evento
          <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Data
          <input type="date" name="data" value={form.data} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Hora
          <input type="time" name="hora" value={form.hora} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Descrição
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4} placeholder="Detalhes sobre o evento..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', minHeight: 60 }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Link da Imagem (opcional)
          <input type="url" name="imagem" value={form.imagem} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <button type="submit" style={{ background: 'linear-gradient(90deg,#2563eb 60%,#7c3aed 100%)', color: '#fff', fontWeight: 600, fontSize: '1.08rem', border: 'none', borderRadius: '10px', padding: '12px 0', cursor: 'pointer' }}>Salvar Evento</button>
      </form>
    </div>
  );
}
