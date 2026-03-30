'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X, Search, ChevronLeft, ChevronRight, Target, ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';

import '@/styles/Backoffice.css';
import type { Paroquia, Distrito, Conselho } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { 
  ssr: false,
  loading: () => <div style={{ height: '300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>A carregar mapa...</div>
});

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
  
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const [uploadingImagem, setUploadingImagem] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resP, resD] = await Promise.all([
          fetch('/api/paroquias'),
          fetch('/api/distritos')
        ]);
        const dataP = await resP.json();
        const dataD = await resD.json();
        setParoquias(Array.isArray(dataP) ? dataP : []);
        setDistritos(Array.isArray(dataD) ? dataD : []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!editForm.distritoId) { setConselhos([]); return; }
    fetch(`/api/conselhos?distritoId=${editForm.distritoId}`)
      .then((res) => res.json())
      .then((data) => setConselhos(Array.isArray(data) ? data : []));
  }, [editForm.distritoId]);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagemFile(file);
    if (file) setImagemPreview(URL.createObjectURL(file));
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja remover a paróquia "${nome}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/paroquias/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setToast({ show: true, type: 'success', message: 'Paróquia removida!' });
      setParoquias(prev => prev.filter(p => p.id !== id));
    } catch { setToast({ show: true, type: 'error', message: 'Erro ao remover.' }); }
  };

  const startEdit = (p: Paroquia) => {
    const partes = p.endereco?.split(', ') || [];
    setEditingId(p.id);
    setImagemPreview(p.imagem || '');
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
      lat: p.lat || '',
      lng: p.lng || '',
      imagem: p.imagem || ''
    });
  };

  const handleEditSubmit = async (id: number) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      let finalImagemUrl = editForm.imagem;

      if (imagemFile) {
        setUploadingImagem(true);
        const uploadData = new FormData();
        uploadData.append('file', imagemFile);
        uploadData.append('folder', 'paroquiaperto/paroquias');
        const uploadRes = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: uploadData });
        const { url } = await uploadRes.json();
        finalImagemUrl = url;
      }

      const payload = {
        ...editForm,
        imagem: finalImagemUrl,
        endereco: `${editForm.rua}, ${editForm.numero}, ${editForm.codigoPostal} ${editForm.cidade}`,
        distritoId: editForm.distritoId ? parseInt(editForm.distritoId, 10) : null,
        conselhoId: editForm.conselhoId ? parseInt(editForm.conselhoId, 10) : null
      };

      const res = await fetch(`/api/paroquias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();

      setToast({ show: true, type: 'success', message: 'Atualizado com sucesso!' });
      setEditingId(null);
      setParoquias(prev => prev.map(item => item.id === id ? { ...item, ...payload, id } : item));
    } catch { setToast({ show: true, type: 'error', message: 'Erro ao salvar.' }); }
    finally { setSubmitting(false); setUploadingImagem(false); }
  };

  const filtered = useMemo(() => paroquias.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())), [paroquias, searchTerm]);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bo-container">
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />
      <AlertModal {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

      <div className="bo-header">
        <h2 className="bo-title">Gestão de Paróquias</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
            <input className="form-input" style={{ paddingLeft: '35px', width: '250px' }} placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary">
            <PlusCircle size={18} /> Inserir
          </Link>
        </div>
      </div>

      <div className="bo-list">
        {loading ? <p className="loading-message">A carregar...</p> : paginated.map((p) => (
          editingId === p.id ? (
            <div key={p.id} className="backoffice-form" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{margin: 0}}>Editar Paróquia</h3>
                <X size={24} onClick={() => setEditingId(null)} style={{ cursor: 'pointer' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <section className="bo-section">
                    <h3>Dados Básicos</h3>
                    <label>Nome<input className="form-input" value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} /></label>
                    <label style={{marginTop: '1rem'}}>Descrição<textarea className="form-input" rows={4} value={editForm.descricao} onChange={e => setEditForm({...editForm, descricao: e.target.value})} /></label>
                  </section>
                  <section className="bo-section" style={{marginTop: '1.5rem'}}>
                    <h3 className="bo-h3-purple">Endereço</h3>
                    <div className="bo-grid-2">
                      <input className="form-input" placeholder="Rua" value={editForm.rua} onChange={e => setEditForm({...editForm, rua: e.target.value})} />
                      <input className="form-input" placeholder="Nº" value={editForm.numero} onChange={e => setEditForm({...editForm, numero: e.target.value})} />
                      <input className="form-input" placeholder="CP" value={editForm.codigoPostal} onChange={e => setEditForm({...editForm, codigoPostal: e.target.value})} />
                      <input className="form-input" placeholder="Cidade" value={editForm.cidade} onChange={e => setEditForm({...editForm, cidade: e.target.value})} />
                      <select value={editForm.distritoId} onChange={e => setEditForm({...editForm, distritoId: e.target.value, conselhoId: ''})} className="form-input">
                        <option value="">Distrito</option>
                        {distritos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                      </select>
                      <select value={editForm.conselhoId} onChange={e => setEditForm({...editForm, conselhoId: e.target.value})} disabled={!editForm.distritoId} className="form-input">
                        <option value="">Conselho</option>
                        {conselhos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                    </div>
                  </section>
                </div>
                <div>
                  <h3>Mapa e Média</h3>
                  <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', marginBottom: '1rem' }}>
                    {editForm.lat && <Mapa coords={{ latitude: parseFloat(editForm.lat), longitude: parseFloat(editForm.lng) }} isEditable={true} onMarkerDrag={(lat, lng) => setEditForm((prev: any) => ({ ...prev, lat: lat.toFixed(7), lng: lng.toFixed(7) }))} />}
                  </div>
                  <label style={{ cursor: 'pointer', display: 'block', padding: '10px', border: '1px dashed #ccc', textAlign: 'center' }}>
                    {imagemPreview ? 'Alterar Imagem' : 'Inserir Imagem'}
                    <input type="file" hidden accept="image/*" onChange={handleImagemChange} />
                  </label>
                  {imagemPreview && <img src={imagemPreview} style={{ width: '100%', height: '120px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }} />}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => handleEditSubmit(p.id)} className="bo-btn bo-btn-primary" disabled={submitting || uploadingImagem}>
                   {submitting || uploadingImagem ? 'A salvar...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="bo-btn bo-btn-light">Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={p.id} className="bo-list-item">
              <div className="bo-list-content">
                <div className="bo-list-title">{p.nome}</div>
                <div className="bo-list-desc">{p.endereco}</div>
              </div>
              <div className="bo-list-actions">
                <button onClick={() => startEdit(p)} className="bo-btn bo-btn-light"><Pencil size={16} /> <span className="hide-mobile">Editar</span></button>
                <button onClick={() => handleDelete(p.id, p.nome)} className="bo-btn bo-btn-light" style={{ color: '#e11d48' }}><Trash2 size={16} /> <span className="hide-mobile">Remover</span></button>
              </div>
            </div>
          )
        ))}
      </div>
      
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(c => Math.max(c-1, 1))} disabled={currentPage === 1}><ChevronLeft size={18}/></button>
          <span style={{ alignSelf: 'center' }}>Página {currentPage} de {totalPages}</span>
          <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(c => Math.min(c+1, totalPages))} disabled={currentPage === totalPages}><ChevronRight size={18}/></button>
        </div>
      )}
      <style jsx>{` @media (max-width: 480px) { .hide-mobile { display: none; } } `}</style>
    </div>
  );
}
