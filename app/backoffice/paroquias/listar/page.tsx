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

// Importação dinâmica do Mapa
const Mapa = dynamic(() => import('@/components/Mapa'), { 
  ssr: false,
  loading: () => <div className="map-loading">A carregar mapa...</div>
});

export default function ListarParoquias() {
  const router = useRouter();
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Modais e Toasts
  const [toast, setToast] = useState({ show: false, type: 'success' as 'success' | 'error', message: '' });
  const [alert, setAlert] = useState({ show: false, type: 'error' as 'error' | 'warning' | 'info', title: '', message: '' });

  // Estados de dados auxiliares (igual ao Inserir)
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);

  // Estado de Edição
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImagem, setUploadingImagem] = useState(false);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>('');

  // O formulário agora tem os campos quebrados (rua, numero, etc) como o Inserir
  const [editForm, setEditForm] = useState({
    nome: '', rua: '', numero: '', codigoPostal: '', cidade: '',
    distritoId: '', conselhoId: '', lat: '', lng: '', telefone: '',
    email: '', descricao: '', site: '', imagem: '', facebook: '',
    instagram: '', whatsapp: '',
  });

  // --- EFEITOS E BUSCAS ---
  const fetchParoquias = () => {
    setLoading(true);
    fetch('/api/paroquias').then(r => r.json()).then(data => setParoquias(data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchParoquias();
    fetch('/api/distritos').then(res => res.json()).then(setDistritos);
  }, []);

  useEffect(() => {
    if (!editForm.distritoId) { setConselhos([]); return; }
    fetch(`/api/conselhos?distritoId=${editForm.distritoId}`).then(res => res.json()).then(setConselhos);
  }, [editForm.distritoId]);

  // --- LÓGICA DE EDIÇÃO ---
  const startEdit = (p: Paroquia) => {
    // Tentar quebrar o endereço (ajuste conforme seu padrão de salvamento)
    // Se o endereço foi salvo como "Rua, Numero, CP Cidade", tentamos separar:
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
      <AlertModal show={alert.show} {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

      <div className="bo-header">
        <h2 className="bo-title">Paróquias</h2>
        <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary">
          <PlusCircle size={18} /> Inserir
        </Link>
      </div>

      <div className="bo-list">
        {paroquias.map((p) => (
          editingId === p.id ? (
            <div key={p.id} className="bo-card edit-mode-active">
              <section className="bo-section">
                <h3>Dados Básicos</h3>
                <input name="nome" value={editForm.nome} onChange={handleEditChange} placeholder="Nome" className="form-input" />
                <textarea name="descricao" value={editForm.descricao} onChange={handleEditChange} placeholder="Descrição" className="form-input" />
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
                <button type="button" className="bo-btn-secondary" onClick={buscarLocalizacao}>
                  <MapPin size={16} /> Atualizar Coordenadas
                </button>
                {editForm.lat && (
                  <div className="map-container-edit">
                    <Mapa 
                      coords={{ latitude: parseFloat(editForm.lat), longitude: parseFloat(editForm.lng) }}
                      isEditable={true}
                      onMarkerDrag={(lat, lng) => setEditForm(prev => ({ ...prev, lat: lat.toFixed(7), lng: lng.toFixed(7) }))}
                    />
                  </div>
                )}
              </section>

              <section className="bo-section">
                <h3>Contactos e Media</h3>
                <div className="bo-grid-2">
                  <input name="telefone" value={editForm.telefone} onChange={handleEditChange} placeholder="Telefone" className="form-input" />
                  <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="E-mail" className="form-input" />
                </div>
                <input type="file" onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImagemFile(file);
                  if (file) setImagemPreview(URL.createObjectURL(file));
                }} />
                {imagemPreview && <img src={imagemPreview} className="img-preview-small" alt="Preview" />}
              </section>

              <div className="bo-card-actions">
                <button onClick={() => handleEditSubmit(p.id)} disabled={submitting} className="bo-btn bo-btn-primary">
                  <Save size={16} /> {submitting ? 'A guardar...' : 'Guardar'}
                </button>
                <button onClick={() => setEditingId(null)} className="bo-btn bo-btn-light">
                  <X size={16} /> Cancelar
                </button>
              </div>
            </div>
          ) : (
            // ... Bloco do item da lista (mesmo que você já tinha) ...
            <div key={p.id} className="bo-list-item">
               <div className="bo-list-content">
                  <div className="bo-list-title">{p.nome}</div>
                  <div className="bo-list-desc">{p.endereco}</div>
               </div>
               <div className="bo-list-actions">
                  <button onClick={() => startEdit(p)} className="bo-btn bo-btn-light">
                    <Pencil size={15} /> Editar
                  </button>
                  {/* ... botão delete ... */}
               </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
