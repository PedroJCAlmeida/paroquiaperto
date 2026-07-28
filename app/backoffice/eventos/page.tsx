'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import ParoquiaSearchSelect from '@/components/ParoquiaSearchSelect';
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
  const router = useRouter();
  
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  
  const initialForm: EventoForm = { 
    paroquiaId: '', 
    titulo: '', 
    data: '', 
    hora: '', 
    descricao: '', 
    imagem: '' 
  };
  const [form, setForm] = useState<EventoForm>(initialForm);
  const selectedParoquiaLabel = useMemo(() => paroquias.find((p) => String(p.id) === form.paroquiaId)?.nome, [paroquias, form.paroquiaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          ...form, 
          paroquiaId: Number(form.paroquiaId) 
        }),
      });
      
      if (response.ok) {
        setForm(initialForm);
        setShowModal(true);
        setShowToast(true);
      } else {
        if (response.status === 401) router.replace('/login');
      }
    } catch (error) {
      alert('Erro ao enviar evento');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="backoffice-page">
      <h2>Inserir Evento</h2>
      
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Sucesso!" message="Evento guardado com sucesso." />
      <Toast show={showToast} type="success" message="Evento guardado!" onClose={() => setShowToast(false)} />

      <form className="backoffice-form" onSubmit={handleSubmit}>
        
        <ParoquiaSearchSelect
          paroquias={paroquias}
          value={form.paroquiaId}
          onChange={(paroquiaId, paroquia) => {
            setForm((prev) => ({ ...prev, paroquiaId }));
          }}
          selectedLabel={selectedParoquiaLabel}
          label="Paróquia"
          placeholder="Pesquisar ou selecionar paróquia..."
        />

        <label>
          Título do Evento
          <input type="text" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ex: Festa da Padroeira" required />
        </label>

        <div className="bo-grid-2">
          <label>
            Data
            <input type="date" name="data" value={form.data} onChange={handleChange} required />
          </label>
          <label>
            Hora
            <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Descrição
          <textarea 
            name="descricao" 
            value={form.descricao} 
            onChange={handleChange} 
            rows={4} 
            placeholder="Detalhes sobre o evento, local específico, etc..." 
          />
        </label>

        <label>
          URL da Imagem (opcional)
          <input 
            type="url" 
            name="imagem" 
            value={form.imagem} 
            onChange={handleChange} 
            placeholder="https://imagem-do-evento.jpg" 
          />
        </label>

        <button type="submit" disabled={submitting} className="bo-btn-primary">
          {submitting ? 'A guardar evento...' : 'Salvar Evento'}
        </button>
      </form>
    </div>
  );
}
