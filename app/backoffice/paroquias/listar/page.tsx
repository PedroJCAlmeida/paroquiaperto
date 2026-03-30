'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';
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
  
  // Estados de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Ajuste conforme preferir

  const [toast, setToast] = useState({ show: false, type: 'success' as 'success' | 'error', message: '' });
  const [alert, setAlert] = useState({ show: false, type: 'error' as 'error' | 'warning' | 'info', title: '', message: '' });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>('');

  const [editForm, setEditForm] = useState({
    nome: '', rua: '', numero: '', codigoPostal: '', cidade: '',
    distritoId: '', conselhoId: '', lat: '', lng: '', telefone: '',
    email: '', descricao: '', site: '', imagem: '', facebook: '',
    instagram: '', whatsapp: '',
  });

  const fetchParoquias = () => {
    setLoading(true);
    fetch('/api/paroquias')
      .then(r => r.json())
      .then(data => setParoquias(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchParoquias();
    fetch('/api/distritos').then(res => res.json()).then(setDistritos).catch(() => {});
  }, []);

  useEffect(() => {
    if (!editForm.distritoId) { setConselhos([]); return; }
    fetch(`/api/conselhos?distritoId=${editForm.distritoId}`).then(res => res.json()).then(setConselhos).catch(() => {});
  }, [editForm.distritoId]);

  // --- LÓGICA DE FILTRO E PAGINAÇÃO ---
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

  // Resetar para a página 1 ao pesquisar
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const startEdit = (p: Paroquia) => {
    const partes = p.endereco?.split(', ') || [];
    const cpCidade = partes[2]?.split(' ') || [];
    setEditingId(p.id);
    setImagemPreview(p.imagem || '');
    setEditForm({
      nome: p.nome || '',
      rua: partes[0] || '',
      numero: partes[1] || '',
      codigoPostal: cpCidade[0] || '',
      cidade: cpCidade.slice(1).join(' ') || '',
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

  const handleEditSubmit = async (id: number) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      let imagemUrl = editForm.imagem;

      if (imagemFile) {
        const uploadData = new FormData();
        uploadData.append('file', imagemFile);
        uploadData.append('folder', 'paroquiaperto/paroquias');
        const uploadRes = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: uploadData });
        const uploadJson = await uploadRes.json();
        imagemUrl = uploadJson.url;
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
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      setToast({ show: true, type: 'success', message: 'Atualizado com sucesso!' });
      setEditingId(null);
      fetchParoquias();
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao atualizar.' });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="bo-container">
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast(t => ({ ...t, show: false }))} />
      <AlertModal {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

      <div className="bo-header">
        <h2 className="bo-title">Paróquias</h2>
        <div className="bo-header-actions" style={{ display: 'flex', gap: '10px' }}>
            <div className="search-container" style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                    type="text" 
                    placeholder="Pesquisar paróquia..." 
                    className="form-input" 
                    style={{ paddingLeft: '35px', margin: 0, height: '40px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary" style={{ height: '40px' }}>
                <PlusCircle size={18} /> Inserir
            </Link>
        </div>
      </div>

      <div className="bo-list">
        {loading ? (
            <p>A carregar...</p>
        ) : paginatedParoquias.length === 0 ? (
            <p className="empty-message">Nenhuma paróquia encontrada.</p>
        ) : (
            paginatedParoquias.map((p) => (
                editingId === p.id ? (
                  <div key={p.id} className="bo-card edit-mode-active" style={{ border: '2px solid #6366f1', padding: '20px' }}>
                    {/* ... (O FORMULÁRIO COMPLETO QUE FIZEMOS ANTERIORMENTE) ... */}
                    <section className="bo-section">
                        <h3>Editar: {p.nome}</h3>
                        <input name="nome" value={editForm.nome} onChange={(e) => setEditForm(prev => ({...prev, nome: e.target.value}))} className="form-input" placeholder="Nome" />
                        <div className="bo-grid-2" style={{ marginTop: '10px' }}>
                            <input name="rua" value={editForm.rua} onChange={(e) => setEditForm(prev => ({...prev, rua: e.target.value}))} placeholder="Rua" className="form-input" />
                            <input name="numero" value={editForm.numero} onChange={(e) => setEditForm(prev => ({...prev, numero: e.target.value}))} placeholder="Nº" className="form-input" />
                        </div>
                    </section>
                    {/* Botões de Ação da Edição */}
                    <div className="bo-card-actions" style={{ marginTop: '20px' }}>
                        <button onClick={() => handleEditSubmit(p.id)} disabled={submitting} className="bo-btn bo-btn-primary">
                            <Save size={16} /> {submitting ? 'A salvar...' : 'Salvar'}
                        </button>
                        <button onClick={() => setEditingId(null)} className="bo-btn bo-btn-light">
                            <X size={16} /> Cancelar
                        </button>
                    </div>
                  </div>
                ) : (
                  <div key={p.id} className="bo-list-item">
                    <div className="bo-list-content">
                      <div className="bo-list-title">{p.nome}</div>
                      <div className="bo-list-desc">{p.endereco}</div>
                    </div>
                    <div className="bo-list-actions">
                      <button onClick={() => startEdit(p)} className="bo-btn bo-btn-light">
                        <Pencil size={15} /> <span className="hide-mobile">Editar</span>
                      </button>
                    </div>
                  </div>
                )
            ))
        )}
      </div>

      {/* --- CONTROLES DE PAGINAÇÃO --- */}
      {totalPages > 1 && (
        <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
            <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bo-btn bo-btn-light"
            >
                <ChevronLeft size={18} /> Anterior
            </button>
            <span style={{ fontWeight: '500' }}>Página {currentPage} de {totalPages}</span>
            <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bo-btn bo-btn-light"
            >
                Próximo <ChevronRight size={18} />
            </button>
        </div>
      )}
    </div>
  );
}
