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
  const [editForm, setEditForm] = useState<{ nome: string; endereco: string; telefone: string; email: string; descricao: string }>({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    descricao: '',
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
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.replace('/login');
          return;
        }
        throw new Error('Erro ao remover');
      }
      setToast({ show: true, type: 'success', message: 'Paróquia removida com sucesso!' });
      fetchParoquias();
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao remover paróquia.' });
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
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const p = paroquias.find((x) => x.id === id);
      const res = await fetch(`/api/paroquias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nome: editForm.nome,
          endereco: editForm.endereco,
          lat: p?.lat,
          lng: p?.lng,
          telefone: editForm.telefone,
          email: editForm.email,
          descricao: editForm.descricao,
          site: p?.site,
          imagem: p?.imagem,
          facebook: p?.facebook,
          instagram: p?.instagram,
          whatsapp: p?.whatsapp,
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.replace('/login');
          return;
        }
        throw new Error('Erro ao editar');
      }
      setToast({ show: true, type: 'success', message: 'Paróquia atualizada com sucesso!' });
      setEditingId(null);
      fetchParoquias();
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao atualizar paróquia.' });
    }
  };

  return (
    <div className="bo-container">
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
      
      <div className="bo-header">
        <h2 className="bo-title">Paróquias</h2>
        <Link href="/backoffice/paroquias" className="bo-btn bo-btn-primary">
          <PlusCircle size={18} /> Inserir
        </Link>
      </div>

      {loading ? (
        <p className="loading-message">A carregar...</p>
      ) : paroquias.length === 0 ? (
        <p className="empty-message">Nenhuma paróquia encontrada.</p>
      ) : (
        <div className="bo-list">
          {paroquias.map((p) =>
            editingId === p.id ? (
              <div key={p.id} className="bo-card" style={{ gap: '1rem' }}>
                <input
                  name="nome"
                  value={editForm.nome}
                  onChange={handleEditChange}
                  placeholder="Nome"
                  className="form-input"
                />
                <input
                  name="endereco"
                  value={editForm.endereco}
                  onChange={handleEditChange}
                  placeholder="Endereço"
                  className="form-input"
                />
                <div className="bo-grid-2" style={{ gap: '1rem' }}>
                  <input
                    name="telefone"
                    value={editForm.telefone}
                    onChange={handleEditChange}
                    placeholder="Telefone"
                    className="form-input"
                  />
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    placeholder="Email"
                    className="form-input"
                  />
                </div>
                <textarea
                  name="descricao"
                  value={editForm.descricao}
                  onChange={handleEditChange}
                  placeholder="Descrição"
                  rows={3}
                  className="form-input"
                />
                <div className="bo-card-actions">
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
                  {(p.telefone || p.email) && (
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>
                      {p.telefone && <span>{p.telefone}</span>}
                      {p.telefone && p.email && <span> · </span>}
                      {p.email && <span>{p.email}</span>}
                    </div>
                  )}
                </div>
                <div className="bo-list-actions">
                  <button onClick={() => startEdit(p)} className="bo-btn bo-btn-light" style={{ padding: '8px 12px' }}>
                    <Pencil size={15} /> <span className="hide-mobile">Editar</span>
                  </button>
                  <button onClick={() => handleDelete(p.id, p.nome)} className="bo-btn bo-btn-light" style={{ color: '#e11d48', padding: '8px 12px' }}>
                    <Trash2 size={15} /> <span className="hide-mobile">Remover</span>
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
      <style jsx>{`
        @media (max-width: 480px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
