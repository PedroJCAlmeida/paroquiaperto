'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle } from 'lucide-react';
import Toast from '@/components/Toast';
import type { Evento } from '@/types';

export default function ListarEventos() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  });

  const fetchEventos = () => {
    setLoading(true);
    fetch('/api/eventos')
      .then((r) => r.json())
      .then((data: Evento[]) => setEventos(Array.isArray(data) ? data : []))
      .catch(() => setEventos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleDelete = async (id: number, titulo: string) => {
    if (!confirm(`Tem certeza que deseja remover o evento "${titulo}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/eventos/${id}`, {
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
      setToast({ show: true, type: 'success', message: 'Evento removido com sucesso!' });
      fetchEventos();
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao remover evento.' });
    }
  };

  const sorted = [...eventos].sort((a, b) => (a.data > b.data ? -1 : 1));

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Eventos</h2>
        <Link
          href="/backoffice/eventos"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, background: '#059669', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
        >
          <PlusCircle size={16} /> Inserir
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>A carregar...</p>
      ) : sorted.length === 0 ? (
        <p style={{ color: '#64748b' }}>Nenhum evento encontrado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map((ev) => (
            <div
              key={ev.id}
              style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{ev.titulo}</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 2 }}>
                  {ev.data} {ev.hora && `· ${ev.hora}`}
                  {ev.paroquia && ` · ${ev.paroquia.nome}`}
                </div>
                {ev.descricao && (
                  <div style={{ color: '#94a3b8', fontSize: '0.87rem', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 480 }}>
                    {ev.descricao}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(ev.id, ev.titulo)}
                title="Remover"
                style={{ padding: '7px 12px', borderRadius: 8, background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
              >
                <Trash2 size={15} /> Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
