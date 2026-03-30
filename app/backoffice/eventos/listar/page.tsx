'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle, Search, ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';
import type { Evento } from '@/types';

export default function ListarEventos() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  });

  // Modal Delete States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventoToDelete, setEventoToDelete] = useState<{ id: number, titulo: string } | null>(null);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/eventos');
      const data = await r.json();
      setEventos(Array.isArray(data) ? data : []);
    } catch (error) {
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Filtro e Paginação
  const filtered = useMemo(() => {
    return eventos.filter(ev => 
      ev.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.paroquia?.nome && ev.paroquia.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [eventos, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered
    .sort((a, b) => (a.data > b.data ? -1 : 1))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteClick = (id: number, titulo: string) => {
    setEventoToDelete({ id, titulo });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventoToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/eventos/${eventoToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        throw new Error('Erro ao remover');
      }

      setToast({ show: true, type: 'success', message: 'Evento removido com sucesso!' });
      fetchEventos();
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao remover evento.' });
    } finally {
      setShowDeleteConfirm(false);
      setEventoToDelete(null);
    }
  };

  return (
    <div className="bo-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
      
      {/* Modal de Confirmação Customizado */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ color: '#e11d48', marginBottom: '1.5rem' }}><Trash2 size={56} style={{ margin: '0 auto' }} /></div>
            <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>Remover Evento</h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              Tem certeza que deseja remover o evento <strong>{eventoToDelete?.titulo}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleConfirmDelete} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#e11d48', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Remover</button>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="bo-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 className="bo-title" style={{ fontSize: '2rem', color: '#243B55' }}>Eventos</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Pesquisar evento..." 
              style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '250px' }} 
              value={searchTerm} 
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            />
          </div>
          <Link href="/backoffice/eventos" className="bo-btn bo-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#243B55', padding: '12px 25px', borderRadius: '8px' }}>
            <PlusCircle size={20} /> Inserir
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="loading-message">A carregar...</p>
      ) : paginated.length === 0 ? (
        <p className="empty-message">Nenhum evento encontrado.</p>
      ) : (
        <div className="bo-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {paginated.map((ev) => (
            <div key={ev.id} className="bo-list-item" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="bo-list-content">
                <div className="bo-list-title" style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.2rem' }}>{ev.titulo}</div>
                <div className="bo-list-desc" style={{ color: '#64748b', fontSize: '1rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> {ev.data} {ev.hora && `· ${ev.hora}`}
                  {ev.paroquia && ` · ${ev.paroquia.nome}`}
                </div>
                {ev.descricao && (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                    {ev.descricao}
                  </div>
                )}
              </div>
              <div className="bo-list-actions">
                <button 
                  onClick={() => handleDeleteClick(ev.id, ev.titulo)} 
                  className="bo-btn bo-btn-light" 
                  style={{ color: '#e11d48', padding: '12px 22px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                >
                  <Trash2 size={18} /> <span className="hide-mobile">Remover</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '4rem', paddingBottom: '3rem' }}>
          <button 
            className="bo-btn bo-btn-light" 
            onClick={() => setCurrentPage(c => Math.max(c-1, 1))} 
            disabled={currentPage === 1} 
            style={{ borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={24}/>
          </button>
          <span style={{ alignSelf: 'center', fontWeight: '700', color: '#243B55', fontSize: '1.1rem' }}>
            {currentPage} / {totalPages}
          </span>
          <button 
            className="bo-btn bo-btn-light" 
            onClick={() => setCurrentPage(c => Math.min(c+1, totalPages))} 
            disabled={currentPage === totalPages} 
            style={{ borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronRight size={24}/>
          </button>
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
