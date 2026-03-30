'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X, MapPin, Search, ChevronLeft, ChevronRight, Globe, Phone, Mail, FileText, MapTagged, ImageIcon, Target } from 'lucide-react';
import dynamic from 'next/dynamic';
import Toast from '@/components/Toast';
import AlertModal from '@/components/AlertModal';
import '@/styles/Backoffice.css'; // Certifique-se que este arquivo existe e tem estilos básicos
import type { Paroquia, Distrito, Conselho } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { 
  ssr: false,
  loading: () => <div className="map-loading-placeholder">A carregar mapa interativo...</div>
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
    fetch('/api/paroquias').then(r => r.json()).then(data => setParoquias(Array.isArray(data) ? data : [])).catch(() => setParoquias([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchParoquias();
    fetch('/api/distritos').then(res => res.json()).then(setDistritos).catch(() => setDistritos([]));
  }, []);

  useEffect(() => {
    if (!editForm.distritoId) { setConselhos([]); return; }
    fetch(`/api/conselhos?distritoId=${editForm.distritoId}`).then(res => res.json()).then(setConselhos).catch(() => setConselhos([]));
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
    // Tentativa simples de quebrar CP e Cidade. Pode precisar de ajuste dependendo de como grava.
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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value, ...(name === 'distritoId' ? { conselhoId: '' } : {}) }));
  };

  const buscarLocalizacao = async () => {
    const { rua, numero, codigoPostal, cidade } = editForm;
    if (!rua || !numero || !codigoPostal || !cidade) {
        setAlert({ show: true, type: 'warning', title: 'Dados Incompletos', message: 'Preencha Rua, Número, CP e Cidade para buscar.' });
        return;
    }
    const enderecoCompleto = `${rua}, ${numero}, ${codigoPostal} ${cidade}`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`);
      const data = await res.json();
      if (data.length > 0) {
          setEditForm(prev => ({ ...prev, lat: data[0].lat, lng: data[0].lon }));
          setToast({ show: true, type: 'success', message: 'Coordenadas atualizadas!' });
      } else {
          setAlert({ show: true, type: 'warning', title: 'Não Encontrado', message: 'Não foi possível encontrar este endereço no mapa.' });
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
      setToast({ show: true, type: 'success', message: 'Paróquia atualizada com sucesso!' });
      setEditingId(null);
      fetchParoquias();
    } catch { setToast({ show: true, type: 'error', message: 'Erro ao atualizar a paróquia.' }); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja remover a paróquia "${nome}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/paroquias/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      setToast({ show: true, type: 'success', message: 'Paróquia removida!' });
      fetchParoquias();
    } catch { setToast({ show: true, type: 'error', message: 'Erro ao remover.' }); }
  };

  return (
    <div className="bo-container">
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast(t => ({ ...t, show: false }))} />
      <AlertModal {...alert} onClose={() => setAlert(a => ({ ...a, show: false }))} />

      <div className="bo-header">
        <h2 className="bo-title">Gestão de Paróquias</h2>
        <div className="bo-header-actions">
          <div className="search-bar-container">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Pesquisar por nome ou endereço..." className="form-input search-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary"><PlusCircle size={18} /> Adicionar Nova</Link>
        </div>
      </div>

      <div className="bo-list-container">
        {loading ? (
            <div className="loading-state">A carregar paróquias...</div>
        ) : paginatedParoquias.length === 0 ? (
            <div className="empty-state">Nenhuma paróquia encontrada.</div>
        ) : paginatedParoquias.map((p) => (
          editingId === p.id ? (
            // --- VISUAL MELHORADO DO FORMULÁRIO DE EDIÇÃO ---
            <div key={p.id} className="bo-edit-card">
              <div className="edit-card-header">
                <h3><Pencil size={20} /> Editar Detalhes: <span className="highlight">{p.nome}</span></h3>
                <button onClick={() => setEditingId(null)} className="close-btn"><X size={20} /></button>
              </div>
              
              <div className="edit-card-body">
                <section className="bo-form-section">
                  <h4><FileText size={18} /> Dados Básicos</h4>
                  <div className="form-group">
                    <label>Nome da Paróquia</label>
                    <input name="nome" value={editForm.nome} onChange={handleEditChange} placeholder="Ex: Paróquia de São Pedro" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label>Descrição / História</label>
                    <textarea name="descricao" value={editForm.descricao} onChange={handleEditChange} placeholder="Breve descrição da paróquia..." className="form-input" rows={4} />
                  </div>
                </section>

                <section className="bo-form-section section-purple">
                  <h4><MapTagged size={18} /> Endereço & Localização</h4>
                  <div className="bo-grid-2-1"> {/* Grid customizado: Rua maior, Nº menor */}
                    <div className="form-group">
                        <label>Rua / Avenida</label>
                        <input name="rua" value={editForm.rua} onChange={handleEditChange} placeholder="Rua Direita" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Nº</label>
                        <input name="numero" value={editForm.numero} onChange={handleEditChange} placeholder="123" className="form-input" />
                    </div>
                  </div>
                  
                  <div className="bo-grid-2">
                    <div className="form-group">
                        <label>Código Postal</label>
                        <input name="codigoPostal" value={editForm.codigoPostal} onChange={handleEditChange} placeholder="1234-567" className="form-input" pattern="\d{4}-\d{3}" />
                    </div>
                    <div className="form-group">
                        <label>Cidade / Localidade</label>
                        <input name="cidade" value={editForm.cidade} onChange={handleEditChange} placeholder="Lisboa" className="form-input" />
                    </div>
                  </div>

                  <div className="bo-grid-2">
                    <div className="form-group">
                        <label>Distrito</label>
                        <select name="distritoId" value={editForm.distritoId} onChange={handleEditChange} className="form-input select-input">
                            <option value="">Selecione o Distrito</option>
                            {distritos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Conselho</label>
                        <select name="conselhoId" value={editForm.conselhoId} onChange={handleEditChange} disabled={!editForm.distritoId} className="form-input select-input">
                            <option value="">Selecione o Conselho</option>
                            {conselhos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>
                  </div>

                  <div className="map-actions-area">
                    <button type="button" className="bo-btn bo-btn-secondary" onClick={buscarLocalizacao}><Target size={16} /> Obter Coordenadas do Endereço</button>
                    <p className="help-text">Após clicar, verifique e ajuste o marcador no mapa se necessário.</p>
                  </div>

                  {editForm.lat && editForm.lng && (
                    <div className="edit-map-container">
                      <Mapa 
                        coords={{ latitude: parseFloat(editForm.lat), longitude: parseFloat(editForm.lng) }} 
                        isEditable={true} 
                        onMarkerDrag={(lat, lng) => setEditForm(prev => ({ ...prev, lat: lat.toFixed(7), lng: lng.toFixed(7) }))} 
                      />
                      <div className="coords-display">
                        <span><strong>Lat:</strong> {editForm.lat}</span>
                        <span><strong>Lng:</strong> {editForm.lng}</span>
                      </div>
                    </div>
                  )}
                </section>

                <section className="bo-form-section section-green">
                  <h4><Phone size={18} /> Contactos & Presença Online</h4>
                  <div className="bo-grid-2">
                    <div className="form-group">
                        <label><Phone size={14} /> Telefone</label>
                        <input name="telefone" value={editForm.telefone} onChange={handleEditChange} placeholder="+351 210 000 000" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label><Mail size={14} /> E-mail</label>
                        <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="contacto@paroquia.pt" className="form-input" type="email" />
                    </div>
                  </div>
                  <div className="bo-grid-2">
                    <div className="form-group">
                        <label><Globe size={14} /> Website</label>
                        <input name="site" value={editForm.site} onChange={handleEditChange} placeholder="https://www.paroquia.pt" className="form-input" type="url" />
                    </div>
                    <div className="form-group">
                        <label><MessageCircle size={14} /> WhatsApp</label>
                        <input name="whatsapp" value={editForm.whatsapp} onChange={handleEditChange} placeholder="Número ou link" className="form-input" />
                    </div>
                  </div>
                  <div className="bo-grid-2">
                    <div className="form-group">
                        <label><Facebook size={14} /> Facebook (URL)</label>
                        <input name="facebook" value={editForm.facebook} onChange={handleEditChange} placeholder="facebook.com/paroquia" className="form-input" type="url" />
                    </div>
                    <div className="form-group">
                        <label><Instagram size={14} /> Instagram (URL)</label>
                        <input name="instagram" value={editForm.instagram} onChange={handleEditChange} placeholder="instagram.com/paroquia" className="form-input" type="url" />
                    </div>
                  </div>
                </section>

                <section className="bo-form-section section-amber">
                  <h4><ImageIcon size={18} /> Imagem de Destaque</h4>
                  <div className="image-upload-area">
                    <div className="file-input-wrapper">
                        <button className="bo-btn-light">Escolher Nova Imagem</button>
                        <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0] || null; setImagemFile(f); if (f) setImagemPreview(URL.createObjectURL(f)); }} />
                    </div>
                    {imagemPreview && (
                        <div className="image-preview-container">
                            <img src={imagemPreview} alt="Pré-visualização" className="img-preview-enhanced" />
                            {uploadingImagem && <div className="uploading-overlay">A carregar...</div>}
                        </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="edit-card-footer">
                <button onClick={() => handleEditSubmit(p.id)} disabled={submitting || uploadingImagem} className="bo-btn bo-btn-primary bo-btn-lg">
                  <Save size={18} /> {submitting ? 'A guardar alterações...' : 'Salvar Alterações'}
                </button>
                <button onClick={() => setEditingId(null)} className="bo-btn bo-btn-light bo-btn-lg">
                  <X size={18} /> Cancelar
                </button>
              </div>
            </div>
          ) : (
            // --- ITEM DA LISTA NORMAL (Restaurado o botão Remover) ---
            <div key={p.id} className="bo-list-item">
              <div className="item-main-content">
                <div className="item-icon">📍</div>
                <div className="item-details">
                  <div className="item-title">{p.nome}</div>
                  <div className="item-meta">{p.endereco}</div>
                </div>
              </div>
              <div className="bo-list-actions">
                <button onClick={() => startEdit(p)} className="action-btn btn-edit" title="Editar paróquia">
                  <Pencil size={16} /> <span>Editar</span>
                </button>
                <button onClick={() => handleDelete(p.id, p.nome)} className="action-btn btn-delete" title="Remover paróquia">
                  <Trash2 size={16} /> <span>Remover</span>
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {/* --- PAGINAÇÃO VISUALMENTE MELHORADA --- */}
      {totalPages > 1 && (
        <div className="bo-pagination">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="pagi-btn">
            <ChevronLeft size={20} />
          </button>
          <div className="pagi-info">
            Página <span className="current">{currentPage}</span> de <span className="total">{totalPages}</span>
            <span className="count-info">({filteredParoquias.length} paróquias no total)</span>
          </div>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="pagi-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* CSS SCOPED para garantir o visual novo sem quebrar o resto */}
      <style jsx global>{`
        /* Header & Search */
        .bo-header-actions { display: flex; gap: 1rem; align-items: center; }
        .search-bar-container { position: relative; flex-grow: 1; max-width: 400px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .search-input { padding-left: 40px !important; margin: 0 !important; width: 100%; height: 42px; }

        /* List Items */
        .bo-list-container { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
        .bo-list-item { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
        .bo-list-item:hover { border-color: #cbd5e1; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .item-main-content { display: flex; gap: 1rem; align-items: center; }
        .item-icon { font-size: 1.5rem; background: #f1f5f9; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
        .item-title { font-weight: 600; color: #1e293b; font-size: 1.1rem; }
        .item-meta { color: #64748b; font-size: 0.9rem; margin-top: 2px; }
        
        .bo-list-actions { display: flex; gap: 0.5rem; }
        .action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s; background: white; color: #475569; }
        .action-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
        .btn-delete { color: #e11d48; border-color: #fecdd3; }
        .btn-delete:hover { background: #fff1f2; border-color: #fda4af; color: #be123c; }
        
        @media (max-width: 640px) { .action-btn span { display: none; } .bo-list-item { flex-direction: column; align-items: flex-start; gap: 1rem; } .bo-list-actions { width: 100%; justify-content: flex-end; } }

        /* Enhanced Edit Card */
        .bo-edit-card { background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; border-left: 5px solid #6366f1; margin: 1rem 0 2rem 0; overflow: hidden; animation: slideIn 0.3s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .edit-card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
        .edit-card-header h3 { margin: 0; display: flex; align-items: center; gap: 10px; color: #1e293b; font-size: 1.25rem; }
        .edit-card-header h3 .highlight { color: #6366f1; font-weight: 700; }
        .close-btn { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px; border-radius: 6px; }
        .close-btn:hover { background: #e2e8f0; color: #475569; }

        .edit-card-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
        
        .bo-form-section { border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 12px; background: #fff; }
        .bo-form-section h4 { margin: 0 0 1.25rem 0; font-size: 1.1rem; font-weight: 600; color: #334155; display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; }
        
        .section-purple { border-color: #e9d5ff; } .section-purple h4 { color: #7e22ce; border-bottom-color: #f3e8ff; }
        .section-green { border-color: #bbf7d0; } .section-green h4 { color: #15803d; border-bottom-color: #dcfce7; }
        .section-amber { border-color: #fde68a; } .section-amber h4 { color: #b45309; border-bottom-color: #fef3c7; }

        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; color: #475569; display: flex; align-items: center; gap: 5px; }
        .form-input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; transition: all 0.2s; }
        .form-input:focus { border-color: #a5b4fc; box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.3); outline: none; }
        textarea.form-input { resize: vertical; }
        .select-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; padding-right: 40px; }

        /* Grids */
        .bo-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .bo-grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }
        @media (max-width: 640px) { .bo-grid-2, .bo-grid-2-1 { grid-template-columns: 1fr; gap: 0; } }

        /* Map Area */
        .map-actions-area { margin: 1rem 0; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .help-text { font-size: 0.85rem; color: #64748b; margin: 0; }
        .edit-map-container { height: 300px; border-radius: 10px; overflow: hidden; border: 1px solid #cbd5e1; position: relative; margin-top: 10px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .coords-display { position: absolute; bottom: 10px; left: 10px; background: rgba(255,255,255,0.9); padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; color: #334155; z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; gap: 10px; border: 1px solid #e2e8f0; }
        .map-loading-placeholder { height: 100%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 0.9rem; }

        /* Image Upload */
        .image-upload-area { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; }
        .file-input-wrapper { position: relative; overflow: hidden; display: inline-block; }
        .file-input-wrapper input[type=file] { font-size: 100px; position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; }
        .image-preview-container { position: relative; width: 120px; height: 120px; border-radius: 12px; overflow: hidden; border: 2px solid #e2e8f0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .img-preview-enhanced { width: 100%; height: 100%; object-fit: cover; }
        .uploading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #475569; font-weight: 500; }

        /* Footer */
        .edit-card-footer { padding: 1.25rem 1.5rem; background: #f8fafc; border-top: 1px solid #eee; display: flex; gap: 1rem; justify-content: flex-end; }
        .bo-btn-lg { padding: 12px 24px; font-size: 1rem; }

        /* Pagination */
        .bo-pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin: 2.5rem 0 1rem 0; background: white; padding: 10px; border-radius: 50px; border: 1px solid #e2e8f0; display: inline-flex; position: relative; left: 50%; transform: translateX(-50%); box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
        .pagi-btn { background: white; border: 1px solid #e2e8f0; color: #64748b; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .pagi-btn:hover:not(:disabled) { background: #f1f5f9; color: #1e293b; border-color: #cbd5e1; }
        .pagi-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pagi-info { color: #475569; font-size: 0.95rem; display: flex; align-items: center; gap: 6px; }
        .pagi-info .current { font-weight: 700; color: #6366f1; font-size: 1.1rem; }
        .pagi-info .total { font-weight: 600; color: #1e293b; }
        .count-info { color: #94a3b8; font-size: 0.85rem; margin-left: 5px; }

        /* States */
        .loading-state, .empty-state { text-align: center; padding: 3rem; background: white; border-radius: 12px; border: 1px solid #e2e8f0; color: #64748b; }
      `}</style>
    </div>
  );
}
