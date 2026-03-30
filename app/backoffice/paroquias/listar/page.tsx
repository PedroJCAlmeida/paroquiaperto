'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X, Search, ChevronLeft, ChevronRight, Target, Phone, Mail, Globe, Instagram, Facebook, MessageCircle, ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';

import '@/styles/Backoffice.css';
import type { Paroquia, Distrito, Conselho } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { 
  ssr: false,
  loading: () => <div style={{ height: '350px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>A carregar mapa...</div>
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
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const [imagemFile, setImagemFile] = useState<File | null>(null);

  // Estados para o Modal de Eliminação customizado (para evitar erro de tipo no AlertModal)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paroquiaToDelete, setParoquiaToDelete] = useState<{ id: number, nome: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resP, resD] = await Promise.all([fetch('/api/paroquias'), fetch('/api/distritos')]);
        setParoquias(await resP.json());
        setDistritos(await resD.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!editForm.distritoId) { setConselhos([]); return; }
    fetch(`/api/conselhos?distritoId=${editForm.distritoId}`).then(res => res.json()).then(setConselhos);
  }, [editForm.distritoId]);

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
      site: p.site || '',
      facebook: p.facebook || '',
      instagram: p.instagram || '',
      whatsapp: p.whatsapp || '',
      lat: p.lat || '',
      lng: p.lng || '',
      imagem: p.imagem || ''
    });
  };

  const handleDeleteClick = (id: number, nome: string) => {
    setParoquiaToDelete({ id, nome });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!paroquiaToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/paroquias/${paroquiaToDelete.id}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) throw new Error();
      setToast({ show: true, type: 'success', message: 'Paróquia removida com sucesso!' });
      setParoquias(prev => prev.filter(p => p.id !== paroquiaToDelete.id));
    } catch { 
      setToast({ show: true, type: 'error', message: 'Erro ao remover paróquia.' }); 
    } finally {
      setShowDeleteConfirm(false);
      setParoquiaToDelete(null);
    }
  };

  const handleEditSubmit = async (id: number) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      let finalUrl = editForm.imagem;

      if (imagemFile) {
        const formData = new FormData();
        formData.append('file', imagemFile);
        formData.append('folder', 'paroquiaperto/paroquias');
        const uploadRes = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
        const data = await uploadRes.json();
        finalUrl = data.url;
      }

      const payload = {
        ...editForm,
        imagem: finalUrl,
        endereco: `${editForm.rua}, ${editForm.numero}, ${editForm.codigoPostal} ${editForm.cidade}`,
        distritoId: editForm.distritoId ? parseInt(editForm.distritoId) : null,
        conselhoId: editForm.conselhoId ? parseInt(editForm.conselhoId) : null
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
    finally { setSubmitting(false); }
  };

  const filtered = useMemo(() => paroquias.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())), [paroquias, searchTerm]);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bo-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />
      <AlertModal {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

      {/* Modal de Confirmação de Eliminação Customizado para evitar erro de build */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ color: '#e11d48', marginBottom: '1rem' }}><Trash2 size={48} style={{ margin: '0 auto' }} /></div>
            <h3 style={{ margin: '0 0 1rem' }}>Confirmar Remoção</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Tem certeza que deseja remover permanentemente a paróquia <strong>{paroquiaToDelete?.nome}</strong>?</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleConfirmDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#e11d48', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Remover</button>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="bo-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 className="bo-title" style={{ fontSize: '2rem', color: '#243B55' }}>Gestão de Paróquias</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
            <input type="text" placeholder="Pesquisar..." style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '250px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#243B55', padding: '12px 25px', borderRadius: '8px' }}>
            <PlusCircle size={20} /> Inserir
          </Link>
        </div>
      </div>

      <div className="bo-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {loading ? <p>A carregar...</p> : paginated.map((p) => (
          editingId === p.id ? (
            <div key={p.id} className="backoffice-form" style={{ background: '#fff', padding: '3rem', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.6rem', color: '#243B55' }}>Editar Paróquia</h3>
                <X size={28} onClick={() => setEditingId(null)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                {/* COLUNA ESQUERDA */}
                <div>
                  <section className="bo-section" style={{ padding: 0, border: 'none' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#6366f1' }}>Dados Básicos</h4>
                    <label style={{ fontSize: '0.9rem' }}>Nome da Paróquia
                      <input className="form-input" value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} />
                    </label>
                    <label style={{ marginTop: '1.5rem', display: 'block', fontSize: '0.9rem' }}>Descrição
                      <textarea className="form-input" rows={4} value={editForm.descricao} onChange={e => setEditForm({...editForm, descricao: e.target.value})} />
                    </label>
                  </section>

                  <section className="bo-section" style={{ padding: 0, border: 'none', marginTop: '2.5rem' }}>
                    <h4 className="bo-h3-purple" style={{ marginBottom: '1rem' }}>Morada e Localidade</h4>
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

                {/* COLUNA DIREITA */}
                <div>
                  <h4 style={{ marginBottom: '1rem', color: '#f59e0b' }}>Mapa e Imagem</h4>
                  <div style={{ height: '350px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                    {editForm.lat && <Mapa coords={{ latitude: parseFloat(editForm.lat), longitude: parseFloat(editForm.lng) }} isEditable={true} onMarkerDrag={(lat, lng) => setEditForm((prev: any) => ({ ...prev, lat: lat.toFixed(7), lng: lng.toFixed(7) }))} />}
                  </div>
                  <label style={{ cursor: 'pointer', display: 'block', padding: '15px', border: '2px dashed #e2e8f0', textAlign: 'center', borderRadius: '12px', background: '#f8fafc' }}>
                    <ImageIcon size={20} style={{ marginRight: '10px' }} /> {imagemPreview ? 'Alterar Imagem' : 'Inserir Imagem'}
                    <input type="file" hidden accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) { setImagemFile(file); setImagemPreview(URL.createObjectURL(file)); } }} />
                  </label>
                  {imagemPreview && <img src={imagemPreview} style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }} alt="Preview" />}
                </div>
              </div>

              <section className="bo-section" style={{ padding: 0, border: 'none', marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={18}/> Contactos e Redes Sociais</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <label>Telefone<input className="form-input" value={editForm.telefone} onChange={e => setEditForm({...editForm, telefone: e.target.value})} /></label>
                  <label>E-mail<input className="form-input" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} /></label>
                  <label>WhatsApp<input className="form-input" value={editForm.whatsapp} onChange={e => setEditForm({...editForm, whatsapp: e.target.value})} /></label>
                  <label>Facebook (URL)<input className="form-input" value={editForm.facebook} onChange={e => setEditForm({...editForm, facebook: e.target.value})} /></label>
                  <label>Instagram (URL)<input className="form-input" value={editForm.instagram} onChange={e => setEditForm({...editForm, instagram: e.target.value})} /></label>
                  <label>Site<input className="form-input" value={editForm.site} onChange={e => setEditForm({...editForm, site: e.target.value})} /></label>
                </div>
              </section>

              <div style={{ display: 'flex', gap: '15px', marginTop: '3.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => handleEditSubmit(p.id)} className="bo-btn bo-btn-primary" style={{ background: '#243B55', padding: '12px 40px' }} disabled={submitting}>
                  <Save size={18} style={{marginRight: '8px'}} /> {submitting ? 'A salvar...' : 'Salvar Alterações'}
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="bo-btn bo-btn-light" style={{ background: '#f1f5f9', padding: '12px 40px' }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={p.id} className="bo-list-item" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.2rem' }}>{p.nome}</div>
                <div style={{ color: '#64748b', fontSize: '1rem', marginTop: '4px' }}>{p.endereco}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => startEdit(p)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', borderRadius: '10px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
                  <Pencil size={18} /> Editar
                </button>
                <button onClick={() => handleDeleteClick(p.id, p.nome)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 22px', borderRadius: '10px', border: 'none', background: '#fff1f2', color: '#e11d48', fontWeight: '600', cursor: 'pointer' }}>
                  <Trash2 size={18} /> Remover
                </button>
              </div>
            </div>
          )
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '4rem', paddingBottom: '3rem' }}>
        <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(c => Math.max(c-1, 1))} disabled={currentPage === 1} style={{ borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={24}/></button>
        <span style={{ alignSelf: 'center', fontWeight: '700', color: '#243B55', fontSize: '1.1rem' }}>{currentPage} / {totalPages}</span>
        <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(c => Math.min(c+1, totalPages))} disabled={currentPage === totalPages} style={{ borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={24}/></button>
      </div>
    </div>
  );
}
