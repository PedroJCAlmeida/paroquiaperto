'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';
import '@/styles/Backoffice.css';
import type { Paroquia, Distrito, Conselho } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { 
  ssr: false,
  loading: () => <div style={{ height: '300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A carregar mapa...</div>
});

export default function ListarParoquias() {
  const router = useRouter();
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [loading, setLoading] = useState(true);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  
  const [toast, setToast] = useState({ show: false, type: 'success' as 'success' | 'error', message: '' });
  const [alert, setAlert] = useState({ show: false, type: 'error' as 'error' | 'warning' | 'info', title: '', message: '' });

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
    fetch('/api/distritos').then(res => res.json()).then(setDistritos).catch(() => setDistritos([]));
  }, []);

  useEffect(() => {
    if (!editForm.distritoId) { setConselhos([]); return; }
    fetch(`/api/conselhos?distritoId=${editForm.distritoId}`).then(res => res.json()).then(setConselhos).catch(() => setConselhos([]));
  }, [editForm.distritoId]);

  const startEdit = (p: Paroquia) => {
    // Tenta quebrar o endereço para preencher os campos individuais
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
      if (data.length > 0) {
        setEditForm(prev => ({ ...prev, lat: data[0].lat, lng: data[0].lon }));
      }
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
        const uploadJson = await uploadRes.json();
        imagemUrl = uploadJson.url;
        setUploadingImagem(false);
      }

      const payload = {
        nome: editForm.nome,
        endereco: `${editForm.rua}, ${editForm.numero}, ${editForm.codigoPostal} ${editForm.cidade}`,
        lat: editForm.lat,
        lng: editForm.lng,
        telefone: editForm.telefone,
        email: editForm.email,
        descricao: editForm.descricao,
        site: editForm.site,
        imagem: imagemUrl,
        facebook: editForm.facebook,
        instagram: editForm.instagram,
        whatsapp: editForm.whatsapp,
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
      {/* Toast e AlertModal corrigidos para evitar erro de duplicidade no build */}
      <Toast 
        show={toast.show} 
        type={toast.type} 
        message={toast.message} 
        onClose={() => setToast(t => ({ ...t, show: false }))} 
      />
      
      <AlertModal 
        {...alert} 
        onClose={() => setAlert(a => ({ ...a, show: false }))} 
      />

      <div className="bo-header">
        <h2 className="bo-title">Paróquias</h2>
        <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary">
          <PlusCircle size={18} /> Inserir
        </Link>
      </div>

      <div className="bo-list">
        {paroquias.map((p) => (
          editingId === p.id ? (
            <div key={p.id} className="bo-card edit-mode-active" style={{ padding: '20px', border: '2px solid #6366f1' }}>
              <section className="bo-section">
                <h3>Dados Básicos</h3>
                <label>Nome da Paróquia</label>
                <input name="nome" value={editForm.nome} onChange={handleEditChange} className="form-input" required />
                <label>Descrição</label>
                <textarea name="descricao" value={editForm.descricao} onChange={handleEditChange} className="form-input" rows={3} />
              </section>

              <section className="bo-section">
                <h3 className="bo-h3-purple">Endereço</h3>
                <div className="bo-grid-2">
                  <input name="rua" value={editForm.rua} onChange={handleEditChange} placeholder="Rua" className="form-input" />
                  <input name="numero" value={editForm.numero} onChange={handleEditChange} placeholder="Nº" className="form-input" />
                  <input name="codigoPostal" value={editForm.codigoPostal} onChange={handleEditChange} placeholder="1234-567" className="form-input" />
                  <input name="cidade" value={editForm.cidade} onChange={handleEditChange} placeholder="Cidade" className="form-input" />
                  
                  <select name="distritoId" value={editForm.distritoId} onChange={handleEditChange} className="form-input">
                    <option value="">Selecione um distrito</option>
                    {distritos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                  </select>
                  
                  <select name="conselhoId" value={editForm.conselhoId} onChange={handleEditChange} disabled={!editForm.distritoId} className="form-input">
                    <option value="">Selecione um conselho</option>
                    {conselhos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              </section>

              <section className="bo-section">
                <h3 className="bo-h3-amber">Localização</h3>
                <button type="button" className="bo-btn-secondary" onClick={buscarLocalizacao} style={{ marginBottom: '10px' }}>
                  <MapPin size={16} /> Buscar Localização
                </button>
                {editForm.lat && editForm.lng && (
                  <div style={{ height: '300px', marginBottom: '10px' }}>
                    <Mapa 
                      coords={{ latitude: parseFloat(editForm.lat), longitude: parseFloat(editForm.lng) }}
                      isEditable={true}
                      onMarkerDrag={(lat, lng) => setEditForm(prev => ({ ...prev, lat: lat.toFixed(7), lng: lng.toFixed(7) }))}
                    />
                  </div>
                )}
                <div className="bo-grid-2">
                   <input value={editForm.lat} readOnly placeholder="Latitude" className="form-input" style={{ background: '#f1f5f9' }} />
                   <input value={editForm.lng} readOnly placeholder="Longitude" className="form-input" style={{ background: '#f1f5f9' }} />
                </div>
              </section>

              <section className="bo-section">
                <h3>Contactos & Redes Sociais</h3>
                <div className="bo-grid-2">
                  <input name="telefone" value={editForm.telefone} onChange={handleEditChange} placeholder="Telefone" className="form-input" />
                  <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="E-mail" className="form-input" />
                  <input name="site" value={editForm.site} onChange={handleEditChange} placeholder="Site" className="form-input" />
                  <input name="whatsapp" value={editForm.whatsapp} onChange={handleEditChange} placeholder="WhatsApp" className="form-input" />
                  <input name="facebook" value={editForm.facebook} onChange={handleEditChange} placeholder="Facebook" className="form-input" />
                  <input name="instagram" value={editForm.instagram} onChange={handleEditChange} placeholder="Instagram" className="form-input" />
                </div>
                <label style={{ marginTop: '10px', display: 'block' }}>Imagem</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImagemFile(file);
                  if (file) setImagemPreview(URL.createObjectURL(file));
                }} />
                {imagemPreview && <img src={imagemPreview} style={{ width: '100px', marginTop: '10px', borderRadius: '8px' }} alt="Preview" />}
              </section>

              <div className="bo-card-actions" style={{ marginTop: '20px' }}>
                <button onClick={() => handleEditSubmit(p.id)} disabled={submitting} className="bo-btn bo-btn-primary">
                  <Save size={16} /> {submitting ? 'A guardar...' : 'Salvar Alterações'}
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
                  <Pencil size={15} /> Editar
                </button>
                <button onClick={() => handleDelete(p.id, p.nome)} className="bo-btn bo-btn-light" style={{ color: '#e11d48' }}>
                  <Trash2 size={15} /> Remover
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

// Funções auxiliares fictícias para o delete (complete com a sua lógica se necessário)
async function handleDelete(id: number, nome: string) {
    if (!confirm(`Remover ${nome}?`)) return;
    await fetch(`/api/paroquias/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    window.location.reload();
}
