'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Church, ChevronDown, X } from 'lucide-react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  
  // Estados para o Combobox (Pesquisa + Seleção)
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const initialForm: HorarioForm = { paroquiaId: '', diaSemana: '', hora: '', tipo: 'Missa' };
  const [form, setForm] = useState<HorarioForm>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setForm((prev) => ({ 
    ...prev, 
    [name]: value 
  }));
};
  
  useEffect(() => {
    fetch('/api/paroquias')
      .then((res) => res.json())
      .then((data: Paroquia[]) => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));

    // Fechar o dropdown ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtragem: Se não houver termo, mostra todas. Se houver, filtra.
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
      const response = await fetch('/api/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, paroquiaId: Number(form.paroquiaId) }),
      });
      
      if (response.ok) {
        setForm(initialForm);
        setSearchTerm('');
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
        
        {/* COMBOBOX: PESQUISA + LISTA */}
        <div className="form-group" style={{ position: 'relative', marginBottom: '20px' }} ref={dropdownRef}>
          <label>Paróquia</label>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            
            <input
              type="text"
              placeholder="Pesquisar ou selecionar..."
              className="form-input"
              style={{ paddingLeft: '40px', paddingRight: '40px', cursor: 'text' }}
              value={searchTerm}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                setForm(prev => ({...prev, paroquiaId: ''})); // Reset ID ao escrever
              }}
              required
            />

            {/* Ícones de interação à direita */}
            <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '5px' }}>
              {searchTerm && <X size={16} onClick={() => {setSearchTerm(''); setForm(prev => ({...prev, paroquiaId: ''}))}} style={{ color: '#94a3b8', cursor: 'pointer' }} />}
              <ChevronDown size={20} onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ color: '#243B55', cursor: 'pointer', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
          </div>

          {/* LISTA DE RESULTADOS (DROPDOWN) */}
         {isDropdownOpen && (
  <ul style={{
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    // FUNDO: Usa var(--card-bg) ou var(--bg-primary) para garantir que não é transparente
    backgroundColor: 'var(--bg-card, #ffffff)', 
    // BORDA: Cor visível em ambos os temas
    border: '1px solid var(--border-color, #e2e8f0)',
    borderRadius: '8px',
    marginTop: '4px',
    maxHeight: '250px',
    overflowY: 'auto',
    // Z-INDEX e SOMBRA: Essencial para sobrepor e dar profundidade
    zIndex: 999, 
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
  }}>
              {paroquiasExibidas.length > 0 ? (
                paroquiasExibidas.map((p) => (
                  <li 
                    key={p.id}
                    onClick={() => selectParoquia(p)}
                    style={{
                      padding: '12px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                      borderBottom: '1px solid #f8fafc', fontSize: '0.9rem',
                      backgroundColor: String(p.id) === form.paroquiaId ? '#f0f4f8' : 'transparent',
                      color: String(p.id) === form.paroquiaId ? '#243B55' : 'inherit',
                      fontWeight: String(p.id) === form.paroquiaId ? '600' : '400'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = String(p.id) === form.paroquiaId ? '#f0f4f8' : 'transparent')}
                  >
                    <Church size={14} opacity={0.6} />
                    {p.nome}
                  </li>
                ))
              ) : (
                <li style={{ padding: '15px', color: '#94a3b8', textAlign: 'center', fontSize: '0.85rem' }}>Nenhum resultado.</li>
              )}
            </ul>
          )}
        </div>

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
