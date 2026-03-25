'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle } from 'lucide-react';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';
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
    <div className="bo-container">
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
      
      <div className="bo-header">
        <h2 className="bo-title">Eventos</h2>
        <Link href="/backoffice/eventos" className="bo-btn bo-btn-primary" style={{ background: '#059669' }}>
          <PlusCircle size={18} /> Inserir
        </Link>
      </div>

      {loading ? (
        <p className="loading-message">A carregar...</p>
      ) : sorted.length === 0 ? (
        <p className="empty-message">Nenhum evento encontrado.</p>
      ) : (
        <div className="bo-list">
          {sorted.map((ev) => (
            <div key={ev.id} className="bo-list-item">
              <div className="bo-list-content">
                <div className="bo-list-title">{ev.titulo}</div>
                <div className="bo-list-desc">
                  {ev.data} {ev.hora && `· ${ev.hora}`}
                  {ev.paroquia && ` · ${ev.paroquia.nome}`}
                </div>
                {ev.descricao && (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {ev.descricao}
                  </div>
                )}
              </div>
              <div className="bo-list-actions">
                <button onClick={() => handleDelete(ev.id, ev.titulo)} className="bo-btn bo-btn-light" style={{ color: '#e11d48' }}>
                  <Trash2 size={16} /> <span className="hide-mobile">Remover</span>
                </button>
              </div>
            </div>
          ))}
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
