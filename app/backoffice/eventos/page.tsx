'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Church, ChevronDown, X, Calendar, Clock, Image as ImageIcon, Type, AlignLeft } from 'lucide-react';
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
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  
  // Estados para o Combobox
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const initialForm: EventoForm = { 
    paroquiaId: '', 
    titulo: '', 
    data: '', 
    hora: '', 
    descricao: '', 
    imagem: '' 
  };
  const [form, setForm] = useState<EventoForm>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetch('/api/paroquias')
      .then((res) => res.json())
      .then((data: Paroquia[]) => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const paroquiasExibidas = useMemo(() => {
    if (!searchTerm) return paroquias;
    return paroquias.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [paroquias, searchTerm]);

  const selectParoquia = (p: Paroquia) => {
    setForm(prev => ({ ...prev, paroquiaId: String(p.id) }));
    setSearchTerm(p.nome);
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
        setSearchTerm('');
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
        
        {/* COMBOBOX PARÓQUIA */}
        <div className="form-group" style={{ position: 'relative', marginBottom: '20px' }} ref={dropdownRef}>
          <label>Paróquia</label>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Pesquisar ou selecionar paróquia..."
              className="form-input"
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
              value={searchTerm}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                setForm(prev => ({...prev, paroquiaId: ''}));
              }}
              required
            />
            <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '5px' }}>
              {searchTerm && <X size={16} onClick={() => {setSearchTerm(''); setForm(prev => ({...prev, paroquiaId: ''}))}} style={{ color: '#94a3b8', cursor: 'pointer' }} />}
              <ChevronDown size={20} onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ color: 'var(--text-main)', cursor: 'pointer', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
          </div>

          {isDropdownOpen && (
            <ul 
              className="dropdown-menu-dark-compat"
              style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                marginTop: '4px', maxHeight: '250px', overflowY: 'auto', zIndex: 100,
                borderRadius: '8px', padding: '0', listStyle: 'none',
                backgroundColor: 'var(--dropdown-bg, #ffffff)', 
                border: '1px solid var(--dropdown-border, #e2e8f0)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
            >
              {paroquiasExibidas.length > 0 ? (
                paroquiasExibidas.map((p) => (
                  <li 
                    key={p.id}
                    onClick={() => selectParoquia(p)}
                    className="dropdown-item-dark-compat"
                    style={{
                      padding: '12px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                      borderBottom: '1px solid var(--dropdown-border, #f1f5f9)',
                      color: 'var(--text-main-compat, #243B55)',
                      backgroundColor: String(p.id) === form.paroquiaId ? 'var(--dropdown-hover)' : 'transparent'
                    }}
                  >
                    <Church size={14} opacity={0.6} />
                    {p.nome}
                  </li>
                ))
              ) : (
                <li style={{ padding: '15px', textAlign: 'center', color: '#94a3b8' }}>Nenhum resultado.</li>
              )}
            </ul>
          )}
        </div>

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
