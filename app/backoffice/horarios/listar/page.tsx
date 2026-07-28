'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Toast from '@/components/Toast';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import AdminListRow from '@/components/AdminListRow';
import '@/styles/Backoffice.css';
import type { Horario } from '@/types';

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function ListarHorarios() {
  const router = useRouter();
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  });

  // Modal Delete States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [horarioToDelete, setHorarioToDelete] = useState<{ id: number; label: string } | null>(null);

  const fetchHorarios = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/horarios');
      const data = await r.json();
      setHorarios(Array.isArray(data) ? data : []);
    } catch (error) {
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  // Filtro e Paginação
  const filtered = useMemo(() => {
    return horarios.filter(h => 
      h.diaSemana.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.paroquia?.nome && h.paroquia.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [horarios, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  const paginated = useMemo(() => {
    return [...filtered]
      .sort((a, b) => DIAS.indexOf(a.diaSemana) - DIAS.indexOf(b.diaSemana))
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filtered, currentPage]);

  const handleDeleteClick = (h: Horario) => {
    setHorarioToDelete({ 
      id: h.id, 
      label: `${h.diaSemana} às ${h.hora} (${h.paroquia?.nome || 'Paróquia'})` 
    });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!horarioToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/horarios/${horarioToDelete.id}`, {
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

      setToast({ show: true, type: 'success', message: 'Horário removido com sucesso!' });
      fetchHorarios();
    } catch {
      setToast({ show: true, type: 'error', message: 'Erro ao remover horário.' });
    } finally {
      setShowDeleteConfirm(false);
      setHorarioToDelete(null);
    }
  };

  return (
    <div className="bo-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
      
      {showDeleteConfirm && (
        <DeleteConfirmModal
          title="Remover Horário"
          message={<><div>Tem certeza que deseja remover o horário:</div><strong>{horarioToDelete?.label}</strong>?</>}
          confirmLabel="Remover"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <div className="bo-header">
        <h2 className="bo-title" style={{ fontSize: '2rem', color: '#243B55' }}>Horários de Missa</h2>
        <div className="bo-toolbar">
          <div className="bo-search">
            <Search size={20} className="bo-search-icon" />
            <input 
              type="text" 
              placeholder="Pesquisar horário ou paróquia..." 
              className="bo-search-input"
              value={searchTerm} 
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            />
          </div>
          <Link href="/backoffice/horarios" className="bo-btn bo-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#243B55', padding: '12px 25px', borderRadius: '8px' }}>
            <PlusCircle size={20} /> Inserir
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="bo-status-text">A carregar...</p>
      ) : paginated.length === 0 ? (
        <p className="bo-status-text">Nenhum horário encontrado.</p>
      ) : (
        <div className="bo-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {paginated.map((h) => (
            <AdminListRow
              key={h.id}
              title={`${h.diaSemana} — ${h.hora}`}
              badge={<span style={{ padding: '2px 12px', borderRadius: 99, background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: 800 }}>{h.tipo}</span>}
              subtitle={h.paroquia?.nome}
              actions={(
                <button 
                  onClick={() => handleDeleteClick(h)} 
                  className="bo-btn bo-btn-light" 
                  style={{ color: '#e11d48', padding: '10px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                >
                  <Trash2 size={16} /> <span className="hide-mobile">Remover</span>
                </button>
              )}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '3rem', paddingBottom: '3rem' }}>
          <button 
            className="bo-btn bo-btn-light" 
            onClick={() => setCurrentPage(c => Math.max(c-1, 1))} 
            disabled={currentPage === 1} 
            style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={20}/>
          </button>
          <span style={{ alignSelf: 'center', fontWeight: '700', color: '#243B55' }}>
            {currentPage} / {totalPages}
          </span>
          <button 
            className="bo-btn bo-btn-light" 
            onClick={() => setCurrentPage(c => Math.min(c+1, totalPages))} 
            disabled={currentPage === totalPages} 
            style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronRight size={20}/>
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
