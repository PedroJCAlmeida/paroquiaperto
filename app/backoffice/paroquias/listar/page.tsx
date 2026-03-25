'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import Toast from '@/components/Toast';
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
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Paróquias</h2>
        <Link
          href="/backoffice/paroquias"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, background: '#243B55', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
        >
          <PlusCircle size={16} /> Inserir
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>A carregar...</p>
      ) : paroquias.length === 0 ? (
        <p style={{ color: '#64748b' }}>Nenhuma paróquia encontrada.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paroquias.map((p) =>
            editingId === p.id ? (
              <div key={p.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  name="nome"
                  value={editForm.nome}
                  onChange={handleEditChange}
                  placeholder="Nome"
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '1rem' }}
                />
                <input
                  name="endereco"
                  value={editForm.endereco}
                  onChange={handleEditChange}
                  placeholder="Endereço"
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '1rem' }}
                />
                <input
                  name="telefone"
                  value={editForm.telefone}
                  onChange={handleEditChange}
                  placeholder="Telefone"
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '1rem' }}
                />
                <input
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '1rem' }}
                />
                <textarea
                  name="descricao"
                  value={editForm.descricao}
                  onChange={handleEditChange}
                  placeholder="Descrição"
                  rows={3}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '1rem', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEditSubmit(p.id)}
                    style={{ padding: '8px 18px', borderRadius: 8, background: '#243B55', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{ padding: '8px 18px', borderRadius: 8, background: '#f1f5f9', color: '#334155', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={p.id}
                style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>{p.nome}</div>
                  <div style={{ color: '#64748b', fontSize: '0.92rem', marginTop: 2 }}>{p.endereco}</div>
                  {(p.telefone || p.email) && (
                    <div style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: 2 }}>
                      {p.telefone && <span>{p.telefone}</span>}
                      {p.telefone && p.email && <span> · </span>}
                      {p.email && <span>{p.email}</span>}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={() => startEdit(p)}
                    title="Editar"
                    style={{ padding: '7px 12px', borderRadius: 8, background: '#f0f9ff', color: '#243B55', border: '1px solid #bae6fd', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Pencil size={15} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.nome)}
                    title="Remover"
                    style={{ padding: '7px 12px', borderRadius: 8, background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Trash2 size={15} /> Remover
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

