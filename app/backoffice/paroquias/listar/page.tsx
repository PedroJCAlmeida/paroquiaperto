'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Save, X } from 'lucide-react';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';
import type { Paroquia } from '@/types';

export default function ListarParoquias() {
  const router = useRouter();
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Estado completo com todos os campos do "Inserir"
  const [editForm, setEditForm] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    descricao: '',
    site: '',
    facebook: '',
    instagram: '',
    whatsapp: '',
    imagem: '',
    lat: '',
    lng: ''
  });

  const fetchParoquias = () => {
    setLoading(true);
    fetch('/api/paroquias')
      .then((r) => r.json())
      .then((data: Paroquia[]) => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchParoquias();
  }, []);

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja remover a paróquia "${nome}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/paroquias/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao remover');
      setToast({ show: true, type: 'success', message: 'Paróquia removida!' });
      fetchParoquias();
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao remover.' });
    }
  };

  const startEdit = (p: Paroquia) => {
    setEditingId(p.id);
    setEditForm({
      nome: p.nome,
      endereco: p.endereco,
      telefone: p.telefone ?? '',
      email: p.email ?? '',
      descricao: p.descricao ?? '',
      site: p.site ?? '',
      facebook: p.facebook ?? '',
      instagram: p.instagram ?? '',
      whatsapp: p.whatsapp ?? '',
      imagem: p.imagem ?? '',
      lat: p.lat?.toString() ?? '',
      lng: p.lng?.toString() ?? ''
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.replace('/login'); return; }

      const res = await fetch(`/api/paroquias/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        // Enviamos TODO o editForm, sem filtrar campos
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error('Erro ao editar');

      setToast({ show: true, type: 'success', message: 'Paróquia atualizada!' });
      setEditingId(null);
      fetchParoquias();
    } catch (error) {
      setToast({ show: true, type: 'error', message: 'Erro ao atualizar.' });
    }
  };

  return (
    <div className="bo-container">
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
      
      <div className="bo-header">
        <h2 className="bo-title">Paróquias</h2>
        <Link href="/backoffice/paroquias/novo" className="bo-btn bo-btn-primary">
          <PlusCircle size={18} /> Inserir
        </Link>
      </div>

      {loading ? (
        <p>A carregar...</p>
      ) : (
        <div className="bo-list">
          {paroquias.map((p) =>
            editingId === p.id ? (
              <div key={p.id} className="bo-card edit-mode">
                <div className="form-group-grid">
                  <input name="nome" value={editForm.nome} onChange={handleEditChange} placeholder="Nome da Paróquia" className="form-input" />
                  <input name="endereco" value={editForm.endereco} onChange={handleEditChange} placeholder="Endereço Completo" className="form-input" />
                  
                  <div className="bo-grid-2">
                    <input name="telefone" value={editForm.telefone} onChange={handleEditChange} placeholder="Telefone" className="form-input" />
                    <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" className="form-input" />
                  </div>

                  <div className="bo-grid-2">
                    <input name="lat" value={editForm.lat} onChange={handleEditChange} placeholder="Latitude" className="form-input" />
                    <input name="lng" value={editForm.lng} onChange={handleEditChange} placeholder="Longitude" className="form-input" />
                  </div>

                  <textarea name="descricao" value={editForm.descricao} onChange={handleEditChange} placeholder="Descrição" rows={3} className="form-input" />
                  
                  <input name="imagem" value={editForm.imagem} onChange={handleEditChange} placeholder="URL da Imagem" className="form-input" />
                  
                  <div className="bo-grid-2">
                    <input name="site" value={editForm.site} onChange={handleEditChange} placeholder="Site" className="form-input" />
                    <input name="whatsapp" value={editForm.whatsapp} onChange={handleEditChange} placeholder="WhatsApp" className="form-input" />
                  </div>

                  <div className="bo-grid-2">
                    <input name="facebook" value={editForm.facebook} onChange={handleEditChange} placeholder="Facebook (URL)" className="form-input" />
                    <input name="instagram" value={editForm.instagram} onChange={handleEditChange} placeholder="Instagram (URL)" className="form-input" />
                  </div>
                </div>

                <div className="bo-card-actions" style={{ marginTop: '1rem' }}>
                  <button onClick={() => handleEditSubmit(p.id)} className="bo-btn bo-btn-primary">
                    <Save size={16} /> Guardar
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
                  <button onClick={() => handleDelete(p.id, p.nome)} className="bo-btn bo-btn-light" style={{ color: '#e11d48' }}>
                    <Trash2 size={15} /> <span className="hide-mobile">Remover</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
