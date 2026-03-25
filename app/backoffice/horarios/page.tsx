'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const initialForm: HorarioForm = { paroquiaId: '', diaSemana: '', hora: '', tipo: 'Missa' };
  const [form, setForm] = useState<HorarioForm>(initialForm);

  useEffect(() => {
    fetch('/api/paroquias')
      .then((res) => res.json())
      .then((data: Paroquia[]) => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paroquiaId: form.paroquiaId, diaSemana: form.diaSemana, hora: form.hora, tipo: form.tipo }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.replace('/login');
          setSubmitting(false);
          return;
        }
        const errorText = await response.text();
        alert(`Erro ao enviar horário: ${response.status} ${errorText}`);
        setSubmitting(false);
        return;
      }
      await response.json();
      setForm(initialForm);
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao enviar horário');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="backoffice-page">
      <h2>Inserir Horário de Missa</h2>
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Obrigado pela colaboração!" message="Horário enviado com sucesso." />
      <Toast show={showToast} type="success" message="Horário enviado com sucesso!" onClose={() => setShowToast(false)} />
      <form className="backoffice-form" onSubmit={handleSubmit}>
        <label>
          Paróquia
          <select name="paroquiaId" value={form.paroquiaId} onChange={handleChange} required>
            <option value="">Selecione uma paróquia</option>
            {paroquias.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          {paroquias.length === 0 && (
            <span style={{ display: 'block', marginTop: 6, color: '#ef4444', fontSize: '0.88rem' }}>
              Nenhuma paróquia disponível. <a href="/backoffice/paroquias" style={{ color: '#243B55', textDecoration: 'underline' }}>Insira uma paróquia</a> primeiro.
            </span>
          )}
        </label>
        <div className="bo-grid-2">
          <label>
            Dia da Semana
            <select name="diaSemana" value={form.diaSemana} onChange={handleChange} required>
              <option value="">Selecione um dia</option>
              {['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label>
            Hora
            <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
          </label>
        </div>
        <label>
          Tipo
          <select name="tipo" value={form.tipo} onChange={handleChange} required>
            {['Missa','Confissão','Adoração','Outros'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting && <span className="bo-spinner" aria-hidden="true" />}
          {submitting ? 'A enviar horário...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

