'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle } from 'lucide-react';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';
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
    <div className="bo-container">
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
      
      <div className="bo-header">
        <h2 className="bo-title">Horários de Missa</h2>
        <Link href="/backoffice/horarios" className="bo-btn bo-btn-primary">
          <PlusCircle size={18} /> Inserir
        </Link>
      </div>

      {loading ? (
        <p className="loading-message">A carregar...</p>
      ) : sorted.length === 0 ? (
        <p className="empty-message">Nenhum horário encontrado.</p>
      ) : (
        <div className="bo-list">
          {sorted.map((h) => (
            <div key={h.id} className="bo-list-item">
              <div className="bo-list-content">
                <div className="bo-list-title">
                  {h.diaSemana} — {h.hora}
                  <span style={{ marginLeft: 10, padding: '2px 10px', borderRadius: 99, background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: 700, verticalAlign: 'middle' }}>
                    {h.tipo}
                  </span>
                </div>
                {h.paroquia && (
                  <div className="bo-list-desc">{h.paroquia.nome}</div>
                )}
              </div>
              <div className="bo-list-actions">
                <button onClick={() => handleDelete(h.id)} className="bo-btn bo-btn-light" style={{ color: '#e11d48' }}>
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
