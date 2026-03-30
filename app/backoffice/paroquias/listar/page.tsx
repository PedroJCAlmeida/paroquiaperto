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
        <div className="bo-header-actions">
          <div className="search-bar-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="form-input search-input" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary">
            <PlusCircle size={18} /> Novo
          </Link>
        </div>
      </div>

      <div className="bo-list-container">
        {loading ? (
            <div className="loading-state">A carregar...</div>
        ) : paginatedParoquias.map((p) => (
          editingId === p.id ? (
            <div key={p.id} className="bo-edit-card">
              <div className="edit-card-header">
                <h3><Pencil size={18} /> Editar Paróquia</h3>
                <button onClick={() => setEditingId(null)} className="close-btn"><X size={20} /></button>
              </div>
              
              <div className="edit-card-body">
                {/* 1. Dados Básicos */}
                <section className="bo-form-section">
                  <h4><FileText size={16} /> Identificação</h4>
                  <input name="nome" value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} className="form-input" placeholder="Nome" />
                  <textarea name="descricao" value={editForm.descricao} onChange={e => setEditForm({...editForm, descricao: e.target.value})} className="form-input" rows={3} placeholder="Descrição" />
                </section>

                {/* 2. Endereço (Onde recriamos o formulário de inserir) */}
                <section className="bo-form-section section-purple">
                  <h4><Map size={16} /> Endereço Completo</h4>
                  <div className="bo-grid-2">
                    <input name="rua" value={editForm.rua} onChange={e => setEditForm({...editForm, rua: e.target.value})} placeholder="Rua" className="form-input" />
                    <input name="numero" value={editForm.numero} onChange={e => setEditForm({...editForm, numero: e.target.value})} placeholder="Nº" className="form-input" />
                    <input name="codigoPostal" value={editForm.codigoPostal} onChange={e => setEditForm({...editForm, codigoPostal: e.target.value})} placeholder="CP (0000-000)" className="form-input" />
                    <input name="cidade" value={editForm.cidade} onChange={e => setEditForm({...editForm, cidade: e.target.value})} placeholder="Cidade" className="form-input" />
                  </div>
                  <div className="bo-grid-2">
                    <select name="distritoId" value={editForm.distritoId} onChange={e => setEditForm({...editForm, distritoId: e.target.value})} className="form-input">
                        <option value="">Distrito</option>
                        {distritos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                    </select>
                    <select name="conselhoId" value={editForm.conselhoId} onChange={e => setEditForm({...editForm, conselhoId: e.target.value})} disabled={!editForm.distritoId} className="form-input">
                        <option value="">Conselho</option>
                        {conselhos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                  </div>
                  <button type="button" className="bo-btn-secondary" onClick={() => {/* função buscarLocalizacao */}} style={{marginTop: '10px'}}><Target size={14}/> Buscar GPS</button>
                </section>

                {/* 3. Contactos */}
                <section className="bo-form-section section-green">
                   <h4><Phone size={16} /> Contactos</h4>
                   <div className="bo-grid-2">
                    <input name="telefone" value={editForm.telefone} onChange={e => setEditForm({...editForm, telefone: e.target.value})} placeholder="Telefone" className="form-input" />
                    <input name="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="Email" className="form-input" />
                   </div>
                </section>
              </div>

              <div className="edit-card-footer">
                <button onClick={() => handleEditSubmit(p.id)} className="bo-btn bo-btn-primary"><Save size={16}/> Salvar</button>
                <button onClick={() => setEditingId(null)} className="bo-btn bo-btn-light">Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={p.id} className="bo-list-item">
              <div className="item-main-content">
                <div className="item-details">
                  <div className="item-title">{p.nome}</div>
                  <div className="item-meta">{p.endereco}</div>
                </div>
              </div>
              <div className="bo-list-actions">
                <button onClick={() => startEdit(p)} className="action-btn btn-edit"><Pencil size={14} /> Editar</button>
                <button onClick={() => {/* handle delete */}} className="action-btn btn-delete"><Trash2 size={14} /> Remover</button>
              </div>
            </div>
          )
        ))}
      </div>

      {totalPages > 1 && (
        <div className="bo-pagination">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="pagi-btn"><ChevronLeft size={18}/></button>
          <span className="pagi-info">Página {currentPage} de {totalPages}</span>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="pagi-btn"><ChevronRight size={18}/></button>
        </div>
      )}
    </main>
  );
}
