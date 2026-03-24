'use client';
import React, { useState, useEffect } from 'react';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';
import type { Paroquia } from '@/types';

interface HorarioForm {
  paroquiaId: string;
  diaSemana: string;
  hora: string;
  tipo: string;
}

export default function InserirHorario() {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const initialForm: HorarioForm = { paroquiaId: '', diaSemana: '', hora: '', tipo: 'Missa' };
  const [form, setForm] = useState<HorarioForm>(initialForm);

  useEffect(() => {
    fetch('/api/paroquias')
      .then((res) => res.json())
      .then((data: Paroquia[]) => setParoquias(data))
      .catch(() => setParoquias([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paroquiaId: form.paroquiaId, diaSemana: form.diaSemana, hora: form.hora, tipo: form.tipo }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao enviar horário: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao enviar horário');
      console.error(error);
    }
  };

  return (
    <div className="backoffice-page">
      <h2>Inserir Horário de Missa</h2>
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Obrigado pela colaboração!" message="Horário enviado com sucesso." />
      <Toast show={showToast} type="success" message="Horário enviado com sucesso!" onClose={() => setShowToast(false)} />
      <form className="backoffice-form" onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '32px 18px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Paróquia
          <select name="paroquiaId" value={form.paroquiaId} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }}>
            <option value="">Selecione uma paróquia</option>
            {paroquias.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Dia da Semana
          <select name="diaSemana" value={form.diaSemana} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }}>
            <option value="">Selecione um dia</option>
            {['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Hora
          <input type="time" name="hora" value={form.hora} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Tipo
          <select name="tipo" value={form.tipo} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }}>
            {['Missa','Confissão','Adoração','Outros'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <button type="submit" style={{ background: 'linear-gradient(90deg,#2563eb 60%,#7c3aed 100%)', color: '#fff', fontWeight: 600, fontSize: '1.08rem', border: 'none', borderRadius: '10px', padding: '12px 0', cursor: 'pointer' }}>Salvar</button>
      </form>
    </div>
  );
}
