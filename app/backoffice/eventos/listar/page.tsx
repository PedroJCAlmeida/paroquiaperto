'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle, Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Toast from '@/components/Toast';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import AdminListRow from '@/components/AdminListRow';
import '@/styles/Backoffice.css';
import type { Evento } from '@/types';

export default function ListarEventos() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  });

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
      
      {showDeleteConfirm && (
        <DeleteConfirmModal
          title="Remover Evento"
          message={<>Tem certeza que deseja remover o evento <strong>{eventoToDelete?.titulo}</strong>?</>}
          confirmLabel="Remover"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <div className="bo-header">
        <h2 className="bo-title" style={{ fontSize: '2rem', color: 'var(--text-main, #243B55)' }}>Eventos</h2>
        <div className="bo-toolbar">
          <div className="bo-search">
            <Search size={20} className="bo-search-icon" />
            <input 
              type="text" 
              placeholder="Pesquisar evento..." 
              className="bo-search-input"
              value={searchTerm} 
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            />
          </div>
          <Link href="/backoffice/eventos/novo" className="bo-btn bo-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', borderRadius: '8px' }}>
            <PlusCircle size={20} /> Inserir
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="bo-status-text">A carregar...</p>
      ) : paginated.length === 0 ? (
        <p className="bo-status-text">Nenhum evento encontrado.</p>
      ) : (
        <div className="bo-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {paginated.map((ev) => (
            <AdminListRow
              key={ev.id}
              title={ev.titulo}
              subtitle={(
                <>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  {ev.data} {ev.hora && `· ${ev.hora}`}
                  {ev.paroquia && ` · ${ev.paroquia.nome}`}
                </>
              )}
              actions={(
                <button 
                  onClick={() => handleDeleteClick(ev.id, ev.titulo)} 
                  className="bo-btn bo-btn-light" 
                  style={{ color: '#e11d48', padding: '12px 22px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                >
                  <Trash2 size={18} /> <span className="hide-mobile">Remover</span>
                </button>
              )}
            />
          ))}
        </div>
      )}

      {/* Paginação Adaptável */}
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
          <span style={{ alignSelf: 'center', fontWeight: '700', color: 'var(--text-main, #243B55)', fontSize: '1.1rem' }}>
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
