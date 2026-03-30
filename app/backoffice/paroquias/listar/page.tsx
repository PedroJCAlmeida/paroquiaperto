'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';

// Importação dos estilos que você já confirmou que usa
import '@/styles/BackofficeLayout.css';
import '@/styles/Backoffice.css';

import type { Paroquia, Distrito, Conselho } from '@/types';

export default function ListarParoquias() {
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [loading, setLoading] = useState(true);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [toast, setToast] = useState({ show: false, type: 'success' as 'success' | 'error', message: '' });
  const [alert, setAlert] = useState({ show: false, type: 'error' as 'error' | 'warning' | 'info', title: '', message: '' });

  // Edit States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Busca de Dados
  useEffect(() => {
    fetch('/api/paroquias').then(r => r.json()).then(data => setParoquias(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
    fetch('/api/distritos').then(res => res.json()).then(setDistritos);
  }, []);

  // Filtro de Pesquisa
  const filteredParoquias = useMemo(() => {
    return paroquias.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.endereco?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [paroquias, searchTerm]);

  const totalPages = Math.ceil(filteredParoquias.length / itemsPerPage);
  const paginatedParoquias = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredParoquias.slice(start, start + itemsPerPage);
  }, [filteredParoquias, currentPage]);

  const startEdit = (p: Paroquia) => {
    const partes = p.endereco?.split(', ') || [];
    setEditingId(p.id);
    setEditForm({
      nome: p.nome,
      rua: partes[0] || '',
      numero: partes[1] || '',
      codigoPostal: partes[2]?.split(' ')[0] || '',
      cidade: partes[2]?.split(' ').slice(1).join(' ') || '',
      distritoId: p.distritoId?.toString() || '',
      conselhoId: p.conselhoId?.toString() || '',
      telefone: p.telefone || '',
      email: p.email || '',
      descricao: p.descricao || '',
    });
  };

  return (
    <main className="backoffice-content">
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />
      <AlertModal {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

      <div className="bo-header">
        <h2 className="bo-title">Gestão de Paróquias</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="search-container" style={{ position: 'relative' }}>
             <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
             <input 
                className="form-input" 
                style={{ paddingLeft: '35px', width: '250px' }} 
                placeholder="Pesquisar..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
             />
          </div>
          <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary">
            <PlusCircle size={18} /> Novo
          </Link>
        </div>
      </div>

      <div className="bo-list">
        {paginatedParoquias.map((p) => (
          editingId === p.id ? (
            /* FORMULÁRIO DE EDIÇÃO - USANDO AS CLASSES DO INSERIR */
            <div key={p.id} className="backoffice-page" style={{ padding: '0', margin: '2rem 0', border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: '#f8fafc', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#1e293b' }}>A editar: {p.nome}</strong>
                <X size={20} onClick={() => setEditingId(null)} style={{ cursor: 'pointer' }} />
              </div>
              
              <form className="backoffice-form" style={{ padding: '2rem' }}>
                <section className="bo-section">
                  <h3>Dados Básicos</h3>
                  <label>Nome da Paróquia
                    <input type="text" value={editForm.nome} className="form-input" onChange={e => setEditForm({...editForm, nome: e.target.value})} />
                  </label>
                  <label>Descrição
                    <textarea value={editForm.descricao} className="form-input" rows={3} onChange={e => setEditForm({...editForm, descricao: e.target.value})} />
                  </label>
                </section>

                <section className="bo-section">
                  <h3 className="bo-h3-purple">Endereço</h3>
                  <div className="bo-grid-2">
                    <label>Rua<input type="text" value={editForm.rua} className="form-input" /></label>
                    <label>Número<input type="text" value={editForm.numero} className="form-input" /></label>
                    <label>Código Postal<input type="text" value={editForm.codigoPostal} className="form-input" /></label>
                    <label>Cidade/Localidade<input type="text" value={editForm.cidade} className="form-input" /></label>
                  </div>
                </section>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" className="bo-btn bo-btn-primary" style={{ background: '#243B55' }}>Salvar</button>
                    <button type="button" className="bo-btn bo-btn-light" onClick={() => setEditingId(null)}>Cancelar</button>
                </div>
              </form>
            </div>
          ) : (
            /* LISTA NORMAL - IGUAL À SUA IMAGEM 1 */
            <div key={p.id} className="bo-list-item" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '500', color: '#334155', fontSize: '1.05rem' }}>{p.nome}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{p.endereco}</div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button onClick={() => startEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                  <Pencil size={18} /> Editar
                </button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                  <Trash2 size={18} /> Remover
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}><ChevronLeft size={18}/></button>
          <span style={{ alignSelf: 'center' }}>{currentPage} / {totalPages}</span>
          <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}><ChevronRight size={18}/></button>
        </div>
      )}
    </main>
  );
}
