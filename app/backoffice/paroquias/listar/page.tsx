'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X, Search, ChevronLeft, ChevronRight, Target, Phone, Mail, Globe, Instagram, Facebook, MessageCircle, ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';

import '@/styles/BackofficeLayout.css';
import '@/styles/Backoffice.css';

import type { Paroquia, Distrito, Conselho } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { 
  ssr: false,
  loading: () => <div style={{ height: '400px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>A carregar mapa...</div>
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
  
  // Estados para Imagem
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
        setParoquias(await resP.json());
        setDistritos(await resD.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!editForm.distritoId) {
      setConselhos([]);
      return;
    }
    fetch(`/api/conselhos?distritoId=${editForm.distritoId}`)
      .then((res) => res.json())
      .then((data) => setConselhos(Array.isArray(data) ? data : []))
      .catch(() => setConselhos([]));
  }, [editForm.distritoId]);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagemFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagemPreview(url);
    }
  };

  const startEdit = (p: Paroquia) => {
    const partes = p.endereco?.split(', ') || [];
    setEditingId(p.id);
    setImagemPreview(p.imagem || ''); // Carrega a imagem atual como preview
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

  const handleEditSubmit = async (id: number) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      let finalImagemUrl = editForm.imagem;

      // Se houver um novo ficheiro, faz upload primeiro
      if (imagemFile) {
        setUploadingImagem(true);
        const uploadData = new FormData();
        uploadData.append('file', imagemFile);
        uploadData.append('folder', 'paroquiaperto/paroquias');
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });

        if (!uploadRes.ok) throw new Error('Erro no upload da imagem');
        
        const { url } = await uploadRes.json();
        finalImagemUrl = url;
        setUploadingImagem(false);
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

      setToast({ show: true, type: 'success', message: 'Paróquia atualizada com sucesso!' });
      setEditingId(null);
      setImagemFile(null);
      setParoquias(prev => prev.map(item => item.id === id ? { ...item, ...payload, id } : item));
    } catch (err) {
      setToast({ show: true, type: 'error', message: 'Erro ao guardar as alterações.' });
    } finally { setSubmitting(false); setUploadingImagem(false); }
  };

  const filteredParoquias = useMemo(() => {
    return paroquias.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [paroquias, searchTerm]);

  const totalPages = Math.ceil(filteredParoquias.length / itemsPerPage);
  const paginated = filteredParoquias.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="backoffice-page" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />
      <AlertModal {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

      <div className="bo-header" style={{ marginBottom: '2rem' }}>
        <h2 className="bo-title">Gestão de Paróquias</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
            <input className="form-input" style={{ paddingLeft: '35px', width: '300px' }} placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary">
            <PlusCircle size={18} /> Novo
          </Link>
        </div>
      </div>

      <div className="bo-list">
        {paginated.map((p) => (
          editingId === p.id ? (
            <div key={p.id} className="backoffice-form" style={{ background: '#fff', padding: '3rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2.5rem', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.6rem' }}>Editar: <span style={{ color: '#6366f1' }}>{p.nome}</span></h3>
                <X size={32} onClick={() => setEditingId(null)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                {/* COLUNA ESQUERDA */}
                <div>
                  <section className="bo-section" style={{ padding: 0, border: 'none', background: 'none' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>Dados Básicos</h4>
                    <label>Nome da Paróquia
                      <input type="text" className="form-input" value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} />
                    </label>
                    <label style={{ marginTop: '1.5rem' }}>Descrição
                      <textarea className="form-input" rows={5} value={editForm.descricao} onChange={e => setEditForm({...editForm, descricao: e.target.value})} />
                    </label>
                  </section>

                  <section className="bo-section" style={{ padding: 0, border: 'none', background: 'none', marginTop: '3rem' }}>
                    <h4 className="bo-h3-purple" style={{ marginBottom: '1.5rem' }}>Localização e Morada</h4>
                    <div className="bo-grid-2">
                      <label>Rua<input type="text" className="form-input" value={editForm.rua} onChange={e => setEditForm({...editForm, rua: e.target.value})} /></label>
                      <label>Número<input type="text" className="form-input" value={editForm.numero} onChange={e => setEditForm({...editForm, numero: e.target.value})} /></label>
                      <label>Código Postal<input type="text" className="form-input" value={editForm.codigoPostal} onChange={e => setEditForm({...editForm, codigoPostal: e.target.value})} /></label>
                      <label>Cidade<input type="text" className="form-input" value={editForm.cidade} onChange={e => setEditForm({...editForm, cidade: e.target.value})} /></label>
                      <label>Distrito
                        <select value={editForm.distritoId} onChange={e => setEditForm({...editForm, distritoId: e.target.value, conselhoId: ''})} className="form-input">
                          <option value="">Distrito</option>
                          {distritos.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
                        </select>
                      </label>
                      <label>Conselho
                        <select value={editForm.conselhoId} onChange={e => setEditForm({...editForm, conselhoId: e.target.value})} disabled={!editForm.distritoId} className="form-input">
                          <option value="">Conselho</option>
                          {conselhos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                      </label>
                    </div>
                  </section>
                </div>

                {/* COLUNA DIREITA */}
                <div>
                  <h4 style={{ marginBottom: '1.5rem' }}>Geolocalização e Imagem</h4>
                  <div style={{ height: '350px', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                    {editForm.lat && editForm.lng && (
                      <Mapa 
                        coords={{ latitude: parseFloat(editForm.lat), longitude: parseFloat(editForm.lng) }}
                        isEditable={true}
                        onMarkerDrag={(lat, lng) => setEditForm((prev: any) => ({ ...prev, lat: lat.toFixed(7), lng: lng.toFixed(7) }))}
                      />
                    )}
                  </div>

                  <label style={{ cursor: 'pointer', display: 'block', padding: '1.5rem', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
                    <ImageIcon size={24} style={{ marginBottom: '8px', color: '#6366f1' }} />
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b' }}>Clique para alterar a Imagem de Destaque</span>
                    <input type="file" accept="image/*" onChange={handleImagemChange} style={{ display: 'none' }} />
                  </label>

                  {imagemPreview && (
                    <div style={{ marginTop: '1rem', position: 'relative', width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={imagemPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* CONTACTOS */}
              <section className="bo-section" style={{ padding: 0, border: 'none', background: 'none', marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem' }}>
                <h4 style={{ marginBottom: '2rem' }}>Contactos e Redes Sociais</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                  <label>Telefone<input type="text" className="form-input" value={editForm.telefone} onChange={e => setEditForm({...editForm, telefone: e.target.value})} /></label>
                  <label>Email<input type="email" className="form-input" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} /></label>
                  <label>Website<input type="url" className="form-input" value={editForm.site} onChange={e => setEditForm({...editForm, site: e.target.value})} /></label>
                  <label>Facebook<input type="url" className="form-input" value={editForm.facebook} onChange={e => setEditForm({...editForm, facebook: e.target.value})} /></label>
                  <label>Instagram<input type="url" className="form-input" value={editForm.instagram} onChange={e => setEditForm({...editForm, instagram: e.target.value})} /></label>
                  <label>WhatsApp<input type="text" className="form-input" value={editForm.whatsapp} onChange={e => setEditForm({...editForm, whatsapp: e.target.value})} /></label>
                </div>
              </section>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => handleEditSubmit(p.id)} className="bo-btn bo-btn-primary" style={{ padding: '1rem 4rem' }} disabled={submitting || uploadingImagem}>
                  <Save size={20} style={{ marginRight: '10px' }} /> {submitting || uploadingImagem ? 'A processar...' : 'Confirmar Alterações'}
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="bo-btn bo-btn-light" style={{ padding: '1rem 4rem' }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={p.id} className="bo-list-item" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.15rem' }}>{p.nome}</div>
                <div style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>{p.endereco}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => startEdit(p)} className="bo-btn bo-btn-light" style={{ padding: '12px 20px' }}><Pencil size={18} /><span style={{ marginLeft: '8px' }}>Editar</span></button>
                <button onClick={() => handleDelete(p.id, p.nome)} className="bo-btn bo-btn-light" style={{ color: '#e11d48', padding: '12px 20px' }}><Trash2 size={18} /><span style={{ marginLeft: '8px' }}>Remover</span></button>
              </div>
            </div>
          )
        ))}
      </div>
      
      {/* Paginação */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '4rem', paddingBottom: '3rem' }}>
        <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(c => Math.max(c-1, 1))} disabled={currentPage === 1}><ChevronLeft size={20}/></button>
        <span style={{ alignSelf: 'center', fontWeight: '600' }}>Página {currentPage} de {totalPages}</span>
        <button className="bo-btn bo-btn-light" onClick={() => setCurrentPage(c => Math.min(c+1, totalPages))} disabled={currentPage === totalPages}><ChevronRight size={20}/></button>
      </div>
    </div>
  );
}
