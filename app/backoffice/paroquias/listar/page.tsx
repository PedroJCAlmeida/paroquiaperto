'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X, MapPin, Search, ChevronLeft, ChevronRight, Globe, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';
import '@/styles/Backoffice.css';
import type { Paroquia, Distrito, Conselho } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { 
  ssr: false,
  loading: () => <div style={{ height: '250px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A carregar mapa...</div>
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
  const itemsPerPage = 8;

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

  const fetchParoquias = () => {
    setLoading(true);
    fetch('/api/paroquias').then(r => r.json()).then(data => setParoquias(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchParoquias();
    fetch('/api/distritos').then(res => res.json()).then(setDistritos).catch(() => {});
  }, []);

  useEffect(() => {
    if (!editForm.distritoId) { setConselhos([]); return; }
    fetch(`/api/conselhos?distritoId=${editForm.distritoId}`).then(res => res.json()).then(setConselhos).catch(() => {});
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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value, ...(name === 'distritoId' ? { conselhoId: '' } : {}) }));
  };

  const buscarLocalizacao = async () => {
    const { rua, numero, codigoPostal, cidade } = editForm;
    if (!rua || !numero || !codigoPostal || !cidade) return;
    const enderecoCompleto = `${rua}, ${numero}, ${codigoPostal} ${cidade}`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`);
      const data = await res.json();
      if (data.length > 0) setEditForm(prev => ({ ...prev, lat: data[0].lat, lng: data[0].lon }));
    } catch (err) { console.error(err); }
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
        const uploadRes = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: uploadData });
        const { url } = await uploadRes.json();
        imagemUrl = url;
        setUploadingImagem(false);
      }
      const payload = {
        ...editForm,
        endereco: `${editForm.rua}, ${editForm.numero}, ${editForm.codigoPostal} ${editForm.cidade}`,
        imagem: imagemUrl,
        distritoId: editForm.distritoId ? parseInt(editForm.distritoId) : null,
        conselhoId: editForm.conselhoId ? parseInt(editForm.conselhoId) : null,
      };
      const res = await fetch(`/api/paroquias/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setToast({ show: true, type: 'success', message: 'Atualizado com sucesso!' });
      setEditingId(null);
      fetchParoquias();
    } catch { setToast({ show: true, type: 'error', message: 'Erro ao atualizar.' }); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Remover paróquia "${nome}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/paroquias/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      setToast({ show: true, type: 'success', message: 'Removida com sucesso!' });
      fetchParoquias();
    } catch { setToast({ show: true, type: 'error', message: 'Erro ao remover.' }); }
  };

  return (
    <div className="bo-container">
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast(t => ({ ...t, show: false }))} />
      <AlertModal {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

      <div className="bo-header">
        <h2 className="bo-title">Paróquias</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder="Procurar..." className="form-input" style={{ paddingLeft: '38px', margin: 0, width: '250px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary"><PlusCircle size={18} /> Inserir</Link>
        </div>
      </div>

      <div className="bo-list">
        {loading ? <p>A carregar...</p> : paginatedParoquias.map((p) => (
          editingId === p.id ? (
            <div key={p.id} className="bo-card edit-mode-active" style={{ border: '2px solid #6366f1', padding: '24px', background: '#fff' }}>
              <section className="bo-section">
                <h3>Dados Básicos</h3>
                <input name="nome" value={editForm.nome} onChange={handleEditChange} placeholder="Nome" className="form-input" />
                <textarea name="descricao" value={editForm.descricao} onChange={handleEditChange} placeholder="Descrição" className="form-input" rows={3} />
              </section>

              <section className="bo-section">
                <h3 className="bo-h3-purple">Endereço</h3>
                <div className="bo-grid-2">
                  <input name="rua" value={editForm.rua} onChange={handleEditChange} placeholder="Rua" className="form-input" />
                  <input name="numero" value={editForm.numero} onChange={handleEditChange} placeholder="Nº" className="form-input" />
                  <input name="codigoPostal" value={editForm.codigoPostal} onChange={handleEditChange} placeholder="1234-567" className="form-input" />
                  <input name="cidade" value={editForm.cidade} onChange={handleEditChange} placeholder="Cidade" className="form-input" />
                  <select name="distritoId" value={editForm.distritoId} onChange={handleEditChange} className="form-input">
                    <option value="">Distrito</option>
                    {distritos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                  </select>
                  <select name="conselhoId" value={editForm.conselhoId} onChange={handleEditChange} disabled={!editForm.distritoId} className="form-input">
                    <option value="">Conselho</option>
                    {conselhos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              </section>

              <section className="bo-section">
                <h3 className="bo-h3-amber">Localização</h3>
                <button type="button" className="bo-btn-secondary" onClick={buscarLocalizacao}><MapPin size={16} /> Buscar no Mapa</button>
                {editForm.lat && (
                  <div style={{ height: '300px', margin: '15px 0', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                    <Mapa coords={{ latitude: parseFloat(editForm.lat), longitude: parseFloat(editForm.lng) }} isEditable={true} onMarkerDrag={(lat, lng) => setEditForm(prev => ({ ...prev, lat: lat.toFixed(7), lng: lng.toFixed(7) }))} />
                  </div>
                )}
              </section>

              <section className="bo-section">
                <h3>Contactos & Redes</h3>
                <div className="bo-grid-2">
                  <input name="telefone" value={editForm.telefone} onChange={handleEditChange} placeholder="Telefone" className="form-input" />
                  <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="E-mail" className="form-input" />
                  <input name="site" value={editForm.site} onChange={handleEditChange} placeholder="Site" className="form-input" />
                  <input name="whatsapp" value={editForm.whatsapp} onChange={handleEditChange} placeholder="WhatsApp" className="form-input" />
                  <input name="facebook" value={editForm.facebook} onChange={handleEditChange} placeholder="Facebook" className="form-input" />
                  <input name="instagram" value={editForm.instagram} onChange={handleEditChange} placeholder="Instagram" className="form-input" />
                </div>
                <div style={{ marginTop: '15px' }}>
                  <label>Alterar Imagem:</label>
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0] || null; setImagemFile(f); if (f) setImagemPreview(URL.createObjectURL(f)); }} />
                  {imagemPreview && <img src={imagemPreview} style={{ width: '120px', display: 'block', marginTop: '10px', borderRadius: '4px' }} />}
                </div>
              </section>

              <div className="bo-card-actions" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <button onClick={() => handleEditSubmit(p.id)} disabled={submitting} className="bo-btn bo-btn-primary"><Save size={16} /> {submitting ? 'A guardar...' : 'Guardar Alterações'}</button>
                <button onClick={() => setEditingId(null)} className="bo-btn bo-btn-light"><X size={16} /> Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={p.id} className="bo-list-item">
              <div className="bo-list-content">
                <div className="bo-list-title">{p.nome}</div>
                <div className="bo-list-desc">{p.endereco}</div>
              </div>
              <div className="bo-list-actions">
                <button onClick={() => startEdit(p)} className="bo-btn bo-btn-light"><Pencil size={15} /> Editar</button>
                <button onClick={() => handleDelete(p.id, p.nome)} className="bo-btn bo-btn-light" style={{ color: '#e11d48' }}><Trash2 size={15} /> Remover</button>
              </div>
            </div>
          )
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px', paddingBottom: '40px' }}>
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="bo-btn bo-btn-light"><ChevronLeft size={18} /> Anterior</button>
          <span>Página <strong>{currentPage}</strong> de {totalPages}</span>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="bo-btn bo-btn-light">Próximo <ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  );
}
