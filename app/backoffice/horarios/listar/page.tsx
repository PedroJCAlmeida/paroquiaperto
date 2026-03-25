'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle } from 'lucide-react';
import Toast from '@/components/Toast';
import type { Horario } from '@/types';

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function ListarHorarios() {
  const router = useRouter();
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  });

  const fetchHorarios = () => {
    setLoading(true);
    fetch('/api/horarios')
      .then((r) => r.json())
      .then((data: Horario[]) => setHorarios(Array.isArray(data) ? data : []))
      .catch(() => setHorarios([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este horário?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/horarios/${id}`, {
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
      setToast({ show: true, type: 'success', message: 'Horário removido com sucesso!' });
      fetchHorarios();
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao remover horário.' });
    }
  };

  const sorted = [...horarios].sort((a, b) => DIAS.indexOf(a.diaSemana) - DIAS.indexOf(b.diaSemana));

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Horários de Missa</h2>
        <Link
          href="/backoffice/horarios"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, background: '#243B55', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
        >
          <PlusCircle size={16} /> Inserir
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>A carregar...</p>
      ) : sorted.length === 0 ? (
        <p style={{ color: '#64748b' }}>Nenhum horário encontrado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map((h) => (
            <div
              key={h.id}
              style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                  {h.diaSemana} — {h.hora}
                  <span style={{ marginLeft: 8, padding: '2px 10px', borderRadius: 99, background: '#E8EDF3', color: '#243B55', fontSize: '0.82rem', fontWeight: 700 }}>{h.tipo}</span>
                </div>
                {h.paroquia && (
                  <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 2 }}>{h.paroquia.nome}</div>
                )}
              </div>
              <button
                onClick={() => handleDelete(h.id)}
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

