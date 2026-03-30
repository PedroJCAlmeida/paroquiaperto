'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X, Search, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';

import '@/styles/BackofficeLayout.css';
import '@/styles/Backoffice.css';

import type { Paroquia, Distrito, Conselho } from '@/types';

export default function ListarParoquias() {
  const router = useRouter();
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [loading, setLoading] = useState(true);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [toast, setToast] = useState({ show: false, type: 'success' as 'success' | 'error', message: '' });
  const [alert, setAlert] = useState({ show: false, type: 'error' as 'error' | 'warning' | 'info', title: '', message: '' });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // 1. Carregar Dados Iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resP, resD] = await Promise.all([
          fetch('/api/paroquias'),
          fetch('/api/distritos')
        ]);
        setParoquias(await resP.json());
        setDistritos(await resD.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // 2. Lógica de Remoção (Delete)
  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja remover a paróquia "${nome}"?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/paroquias/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error();

      setToast({ show: true, type: 'success', message: 'Paróquia removida com sucesso!' });
      setParoquias(prev => prev.filter(p => p.id !== id));
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao remover a paróquia.' });
    }
  };

  // 3. Preparar Edição (Popular campos)
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
      lat: p.lat,
      lng: p.lng
    });
  };

  // 4. Submeter Edição (Put)
  const handleEditSubmit = async (id: number) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...editForm,
        endereco: `${editForm.rua}, ${editForm.numero}, ${editForm.codigoPostal} ${editForm.cidade}`,
        distritoId: parseInt(editForm.distritoId),
        conselhoId: parseInt(editForm.conselhoId)
      };

      const res = await fetch(`/api/paroquias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();

      setToast({ show: true, type: 'success', message: 'Atualizado com sucesso!' });
      setEditingId(null);
      // Atualiza a lista local
      setParoquias(prev => prev.map(item => item.id === id ? { ...item, ...payload, id } : item));
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao salvar alterações.' });
    } finally { setSubmitting(false); }
  };

  // Filtro e Paginação
  const filteredParoquias = useMemo(() => {
    return paroquias.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [paroquias, searchTerm]);

  const totalPages = Math.ceil(filteredParoquias.length / itemsPerPage);
  const paginated = filteredParoquias.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  return (
    <div className="backoffice-page">
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />
      <AlertModal {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

      <div className="bo-header" style={{ marginBottom: '2rem' }}>
        <h2 className="bo-title">Gestão de Paróquias</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
            <input className="form-input" style={{ paddingLeft: '35px' }} placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary">
            <PlusCircle size={18} /> Novo
          </Link>
        </div>
      </div>

      <div className="bo-list">
        {paginated.map((p) => (
          editingId === p.id ? (
            /* FORMULÁRIO DE EDIÇÃO IDENTICO AO INSERIR */
            <div key={p.id} className="backoffice-form" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Editar Paróquia</h3>
                <X size={24} onClick={() => setEditingId(null)} style={{ cursor: 'pointer' }} />
              </div>
              
              <section className="bo-section">
                <h3>Dados Básicos</h3>
                <label>Nome da Paróquia
                  <input type="text" className="form-input" value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} />
                </label>
                <label>Descrição
                  <textarea className="form-input" rows={3} value={editForm.descricao} onChange={e => setEditForm({...editForm, descricao: e.target.value})} />
                </label>
              </section>

              <section className="bo-section">
                <h3 className="bo-h3-purple">Endereço</h3>
                <div className="bo-grid-2">
                  <label>Rua<input type="text" className="form-input" value={editForm.rua} onChange={e => setEditForm({...editForm, rua: e.target.value})} /></label>
                  <label>Número<input type="text" className="form-input" value={editForm.numero} onChange={e => setEditForm({...editForm, numero: e.target.value})} /></label>
                  <label>Código Postal<input type="text" className="form-input" value={editForm.codigoPostal} onChange={e => setEditForm({...editForm, codigoPostal: e.target.value})} /></label>
                  <label>Cidade<input type="text" className="form-input" value={editForm.cidade} onChange={e => setEditForm({...editForm, cidade: e.target.value})} /></label>
                </div>
              </section>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => handleEditSubmit(p.id)} className="bo-btn bo-btn-primary" disabled={submitting}>
                  {submitting ? 'A salvar...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="bo-btn bo-btn-light">Cancelar</button>
              </div>
            </div>
          ) : (
            /* ITEM DA LISTA */
            <div key={p.id} className="bo-list-item" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b' }}>{p.nome}</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{p.endereco}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => startEdit(p)} className="bo-btn bo-btn-light" style={{ padding: '8px 12px' }}>
                  <br><Pencil size={15} /> <span className="hide-mobile">Editar</span><br>
                </button>
                <br><button onClick={() => handleDelete(p.id, p.nome)} className="bo-btn bo-btn-light" style={{ color: '#e11d48', padding: '8px 12px' }}>
                  <br><Trash2 size={15} /> <span className="hide-mobile">Remover</span><br> 
                </button><br> 
              </div>
            </div>
          )
        ))}
      </div>
      
      {/* Paginação Simples */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(c => Math.max(c-1, 1))} disabled={currentPage === 1}><ChevronLeft size={18}/></button>
        <span style={{ alignSelf: 'center' }}>{currentPage} / {totalPages}</span>
        <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(c => Math.min(c+1, totalPages))} disabled={currentPage === totalPages}><ChevronRight size={18}/></button>
      </div>
    </div>
  );
}
