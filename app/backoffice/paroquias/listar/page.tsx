'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Pencil, Trash2, PlusCircle, Save, X, MapPin, 
  Search, ChevronLeft, ChevronRight, Globe, 
  Phone, Mail, FileText, Map, ImageIcon, Target 
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';

// Importamos os estilos do layout e do backoffice
import '@/styles/BackofficeLayout.css'; 
import '@/styles/Backoffice.css'; 

import type { Paroquia, Distrito, Conselho } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { 
  ssr: false,
  loading: () => <div className="map-loading-placeholder">A carregar mapa...</div>
});

export default function ListarParoquias() {
  const router = useRouter();
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
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImagem, setUploadingImagem] = useState(false);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>('');

  const [editForm, setEditForm] = useState({
    nome: '', rua: '', numero: '', codigoPostal: '', cidade: '',
    distritoId: '', conselhoId: '', lat: '', lng: '', telefone: '',
    email: '', descricao: '', site: '', imagem: '', facebook: '',
    instagram: '', whatsapp: '',
  });

  // Busca inicial de dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resParoquias, resDistritos] = await Promise.all([
          fetch('/api/paroquias'),
          fetch('/api/distritos')
        ]);
        const dataP = await resParoquias.json();
        const dataD = await resDistritos.json();
        setParoquias(Array.isArray(dataP) ? dataP : []);
        setDistritos(Array.isArray(dataD) ? dataD : []);
      } catch (err) {
        console.error("Erro ao carregar dados", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Busca conselhos quando muda o distrito na edição
  useEffect(() => {
    if (!editForm.distritoId) { setConselhos([]); return; }
    fetch(`/api/conselhos?distritoId=${editForm.distritoId}`)
      .then(res => res.json())
      .then(setConselhos)
      .catch(() => setConselhos([]));
  }, [editForm.distritoId]);

  // Filtro e Paginação
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

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const startEdit = (p: Paroquia) => {
    const partes = p.endereco?.split(', ') || [];
    const cpCidadePartes = partes[2]?.split(' ') || [];
    
    setEditingId(p.id);
    setImagemPreview(p.imagem || '');
    setEditForm({
      nome: p.nome || '',
      rua: partes[0] || '',
      numero: partes[1] || '',
      codigoPostal: cpCidadePartes[0] || '',
      cidade: cpCidadePartes.slice(1).join(' ') || '',
      distritoId: p.distritoId?.toString() || '',
      conselhoId: p.conselhoId?.toString() || '',
      lat: p.lat?.toString() || '',
      lng: p.lng?.toString() || '',
      telefone: p.telefone ?? '',
      email: p.email ?? '',
      descricao: p.descricao ?? '',
      site: p.site ?? '',
      imagem: p.imagem ?? '',
      facebook: p.facebook ?? '',
      instagram: p.instagram ?? '',
      whatsapp: p.whatsapp ?? '',
    });
  };

  const handleDelete = async (id: number, nome: string) => {
  if (!confirm(`Tem certeza que deseja remover a paróquia "${nome}"?`)) return;
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/paroquias/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
    });

    if (!res.ok) throw new Error('Erro ao remover');

    setToast({ show: true, type: 'success', message: 'Paróquia removida com sucesso!' });
    // Atualiza a lista local filtrando a removida
    setParoquias(prev => prev.filter(p => p.id !== id));
  } catch (error) {
    setToast({ show: true, type: 'error', message: 'Não foi possível remover a paróquia.' });
  }
};
  
  const handleEditSubmit = async (id: number) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      let imagemUrl = editForm.imagem;
      
      if (imagemFile) {
        setUploadingImagem(true);
        const uploadData = new FormData();
        uploadData.append('file', imagemFile);
        uploadData.append('folder', 'paroquiaperto/paroquias');
        const uploadRes = await fetch('/api/upload', { 
            method: 'POST', 
            headers: { Authorization: `Bearer ${token}` }, 
            body: uploadData 
        });
        const data = await uploadRes.json();
        imagemUrl = data.url;
        setUploadingImagem(false);
      }

      const payload = {
        ...editForm,
        endereco: `${editForm.rua}, ${editForm.numero}, ${editForm.codigoPostal} ${editForm.cidade}`,
        imagem: imagemUrl,
        distritoId: editForm.distritoId ? parseInt(editForm.distritoId) : null,
        conselhoId: editForm.conselhoId ? parseInt(editForm.conselhoId) : null,
      };

      const res = await fetch(`/api/paroquias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();
      
      setToast({ show: true, type: 'success', message: 'Paróquia atualizada!' });
      setEditingId(null);
      // Recarregar lista localmente para performance
      setParoquias(prev => prev.map(item => item.id === id ? { ...item, ...payload, id } : item));
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao atualizar.' });
    } finally {
      setSubmitting(false);
    }
  };

 return (
  <main className="backoffice-content">
    <Toast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />
    <AlertModal {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

    <div className="bo-header">
      <h2 className="bo-title">Gestão de Paróquias</h2>
      <div className="bo-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="search-bar-container" style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="form-input" 
            style={{ paddingLeft: '35px', margin: 0, height: '42px', width: '250px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary" style={{ height: '42px', display: 'flex', alignItems: 'center' }}>
          <PlusCircle size={18} /> Novo
        </Link>
      </div>
    </div>

    <div className="bo-list-container" style={{ marginTop: '2rem' }}>
      {loading ? (
        <div className="loading-state">A carregar...</div>
      ) : paginatedParoquias.map((p) => (
        editingId === p.id ? (
          /* FORMULÁRIO DE EDIÇÃO - REESTRUTURADO PARA IGUALAR AO INSERIR */
          <div key={p.id} className="backoffice-page" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><Pencil size={20} /> Editar Paróquia</h3>
              <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={24} /></button>
            </div>

            <form className="backoffice-form" onSubmit={(e) => { e.preventDefault(); handleEditSubmit(p.id); }}>
              
              {/* Seção Dados Básicos */}
              <section className="bo-section" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Dados Básicos</h3>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  Nome da Paróquia
                  <input type="text" name="nome" value={editForm.nome} onChange={handleEditChange} required className="form-input" style={{ width: '100%', marginTop: '5px' }} />
                </label>
                <label style={{ display: 'block' }}>
                  Descrição
                  <textarea name="descricao" value={editForm.descricao} onChange={handleEditChange} className="form-input" style={{ width: '100%', marginTop: '5px' }} rows={3} />
                </label>
              </section>

              {/* Seção Endereço - GRID IGUAL AO INSERIR */}
              <section className="bo-section" style={{ marginBottom: '2rem' }}>
                <h3 className="bo-h3-purple" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Endereço</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label>Rua<input type="text" name="rua" value={editForm.rua} onChange={handleEditChange} required className="form-input" style={{ width: '100%' }} /></label>
                  <label>Número<input type="text" name="numero" value={editForm.numero} onChange={handleEditChange} required className="form-input" style={{ width: '100%' }} /></label>
                  <label>Código Postal<input type="text" name="codigoPostal" value={editForm.codigoPostal} onChange={handleEditChange} required className="form-input" style={{ width: '100%' }} /></label>
                  <label>Cidade/Localidade<input type="text" name="cidade" value={editForm.cidade} onChange={handleEditChange} required className="form-input" style={{ width: '100%' }} /></label>
                </div>
              </section>

              {/* Seção Contactos */}
              <section className="bo-section" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Contactos & Redes Sociais</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label>Telefone<input type="text" name="telefone" value={editForm.telefone} onChange={handleEditChange} className="form-input" style={{ width: '100%' }} /></label>
                  <label>E-mail<input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="form-input" style={{ width: '100%' }} /></label>
                </div>
              </section>

              {/* Ações do Formulário */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <button type="submit" disabled={submitting} className="bo-btn bo-btn-primary" style={{ padding: '0.75rem 2rem' }}>
                  {submitting ? 'A salvar...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="bo-btn bo-btn-light" style={{ padding: '0.75rem 2rem' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ITEM DA LISTA - VISUAL LIMPO DA PRIMEIRA IMAGEM */
          <div key={p.id} className="bo-list-item" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1e293b' }}>{p.nome}</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>{p.endereco}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(p)} className="action-btn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '0.8rem' }}>
                <Pencil size={18} /> Editar
              </button>
              <button onClick={() => handleDelete(p.id, p.nome)} className="action-btn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#e11d48', fontSize: '0.8rem' }}>
                <Trash2 size={18} /> Remover
              </button>
            </div>
          </div>
        )
      ))}
    </div>

    {/* Paginação */}
    {totalPages > 1 && (
      <div className="bo-pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="pagi-btn"><ChevronLeft size={20}/></button>
        <span style={{ color: '#475569' }}>Página <strong>{currentPage}</strong> de {totalPages}</span>
        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="pagi-btn"><ChevronRight size={20}/></button>
      </div>
    )}
  </main>
);
