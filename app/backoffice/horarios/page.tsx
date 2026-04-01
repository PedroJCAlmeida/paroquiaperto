'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Church, X } from 'lucide-react'; // Ícones para melhorar a UI
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
  
  // Estados para a pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const initialForm: HorarioForm = { paroquiaId: '', diaSemana: '', hora: '', tipo: 'Missa' };
  const [form, setForm] = useState<HorarioForm>(initialForm);

  useEffect(() => {
    fetch('/api/paroquias')
      .then((res) => res.json())
      .then((data: Paroquia[]) => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));
  }, []);

  // Filtragem inteligente das paróquias
  const paroquiasFiltradas = useMemo(() => {
    return paroquias.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [paroquias, searchTerm]);

  // Encontrar o nome da paróquia selecionada para mostrar no input
  const selectedParoquiaName = useMemo(() => {
    return paroquias.find(p => String(p.id) === form.paroquiaId)?.nome || '';
  }, [paroquias, form.paroquiaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const selectParoquia = (id: number, nome: string) => {
    setForm(prev => ({ ...prev, paroquiaId: String(id) }));
    setSearchTerm(nome);
    setIsDropdownOpen(false);
  };

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
      
      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/login');
          return;
        }
        throw new Error('Erro na resposta');
      }

      setForm(initialForm);
      setSearchTerm('');
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao enviar horário');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="backoffice-page">
      <h2>Inserir Horário de Missa</h2>
      
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Sucesso!" message="Horário enviado com sucesso." />
      <Toast show={showToast} type="success" message="Horário enviado com sucesso!" onClose={() => setShowToast(false)} />

      <form className="backoffice-form" onSubmit={handleSubmit}>
        
        {/* COMPONENTE DE PESQUISA CUSTOMIZADO */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <label>Paróquia</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Pesquisar nome da paróquia..."
              className="form-input"
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                if (form.paroquiaId) setForm(prev => ({...prev, paroquiaId: ''}));
              }}
              required
            />
            {searchTerm && (
              <X 
                size={18} 
                onClick={() => {setSearchTerm(''); setForm(prev => ({...prev, paroquiaId: ''}))}}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer' }} 
              />
            )}
          </div>

          {/* DROPDOWN DE RESULTADOS */}
          {isDropdownOpen && (searchTerm || isDropdownOpen) && (
            <ul style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
              marginTop: '4px', maxHeight: '200px', overflowY: 'auto', zIndex: 10,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              {paroquiasFiltradas.length > 0 ? (
                paroquiasFiltradas.map((p) => (
                  <li 
                    key={p.id}
                    onClick={() => selectParoquia(p.id, p.nome)}
                    style={{
                      padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                      borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Church size={14} color="#243B55" />
                    {p.nome}
                  </li>
                ))
              ) : (
                <li style={{ padding: '10px 15px', color: '#94a3b8', fontSize: '0.85rem' }}>Nenhuma paróquia encontrada.</li>
              )}
            </ul>
          )}
        </div>

        <div className="bo-grid-2">
          <label>
            Dia da Semana
            <select name="diaSemana" value={form.diaSemana} onChange={handleChange} required>
              <option value="">Selecione um dia</option>
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
            {['Missa','Confissão','Adoração','Outros'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <button type="submit" disabled={submitting} style={{ marginTop: '10px' }}>
          {submitting ? 'A salvar...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
