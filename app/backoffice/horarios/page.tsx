'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import ParoquiaSearchSelect from '@/components/ParoquiaSearchSelect';
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
  const selectedParoquiaLabel = useMemo(() => paroquias.find((p) => String(p.id) === form.paroquiaId)?.nome, [paroquias, form.paroquiaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  useEffect(() => {
    fetch('/api/paroquias')
      .then((res) => res.json())
      .then((data: Paroquia[]) => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.paroquiaId) {
      alert("Por favor, selecione uma paróquia da lista.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, paroquiaId: Number(form.paroquiaId) }),
      });
      
      if (response.ok) {
        setForm(initialForm);
        setShowModal(true);
        setShowToast(true);
      }
    } catch (error) {
      alert('Erro ao enviar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="backoffice-page">
      <h2>Inserir Horário</h2>
      
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Sucesso!" message="Horário guardado." />
      <Toast show={showToast} type="success" message="Horário guardado!" onClose={() => setShowToast(false)} />

      <form className="backoffice-form" onSubmit={handleSubmit}>
        
        <ParoquiaSearchSelect
          paroquias={paroquias}
          value={form.paroquiaId}
          onChange={(paroquiaId, paroquia) => {
            setForm((prev) => ({ ...prev, paroquiaId }));
          }}
          selectedLabel={selectedParoquiaLabel}
          label="Paróquia"
          placeholder="Pesquisar ou selecionar..."
        />

        <div className="bo-grid-2">
          <label>
            Dia da Semana
            <select name="diaSemana" value={form.diaSemana} onChange={handleChange} required>
              <option value="">Selecione...</option>
              {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo', 'Seg-Sex', 'Feriados'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
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
            {['Missa','Confissão','Adoração','Catequese','Terço','Outros'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <button type="submit" disabled={submitting} className="bo-btn-primary">
          {submitting ? 'A guardar...' : 'Guardar Horário'}
        </button>
      </form>
    </div>
  );
}
