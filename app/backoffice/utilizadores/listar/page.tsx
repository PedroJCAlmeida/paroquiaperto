'use client';
import React, { useEffect, useMemo, useState } from 'react';
import RoleRoute from '@/components/RoleRoute';
import { Search, ShieldCheck, UserCircle2 } from 'lucide-react';
import '@/styles/Backoffice.css';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ListarUtilizadoresAdmin() {
  const [utilizadores, setUtilizadores] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<'id' | 'name' | 'email' | 'role'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/usuarios', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error ?? 'Erro ao carregar utilizadores.');
        }
        setUtilizadores(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar utilizadores.'))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return utilizadores.filter((u) => {
      const roleMatches = roleFilter === 'all' ? true : u.role.toLowerCase() === roleFilter;
      if (!roleMatches) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, roleFilter, utilizadores]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, itemsPerPage, sortKey, sortDirection]);

  const ordenados = useMemo(() => {
    const sorted = [...filtrados];
    sorted.sort((a, b) => {
      if (sortKey === 'id') {
        return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
      }

      const aValue = String(a[sortKey] ?? '').toLowerCase();
      const bValue = String(b[sortKey] ?? '').toLowerCase();
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filtrados, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(ordenados.length / itemsPerPage));
  const paginados = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return ordenados.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, ordenados]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (key: 'id' | 'name' | 'email' | 'role') => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('asc');
  };

  const sortIndicator = (key: 'id' | 'name' | 'email' | 'role') => {
    if (sortKey !== key) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <RoleRoute role="admin">
      <div className="bo-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        <div className="bo-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 className="bo-title" style={{ fontSize: '2rem', color: '#243B55', marginBottom: '0.4rem' }}>
              Utilizadores da Plataforma
            </h2>
            <p style={{ color: '#64748b', margin: 0 }}>Visível apenas para administradores.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Pesquisar por nome, e-mail ou role..."
                style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '320px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#334155', fontWeight: 600 }}
            >
              <option value="all">Todas as roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#334155', fontWeight: 600 }}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
        </div>

        <p style={{ marginTop: '-0.8rem', marginBottom: '1.2rem', color: '#64748b', fontSize: '0.9rem' }}>
          A mostrar {paginados.length} de {ordenados.length} utilizadores filtrados ({utilizadores.length} no total).
        </p>

        {error && (
          <div style={{ color: '#b91c1c', background: '#fee2e2', padding: '12px 14px', borderRadius: '10px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="bo-card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1.4fr 180px', padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#334155' }}>
            <button type="button" onClick={() => handleSort('id')} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>ID</span><span style={{ color: '#64748b', fontSize: '0.82rem' }}>{sortIndicator('id')}</span>
            </button>
            <button type="button" onClick={() => handleSort('name')} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>Nome</span><span style={{ color: '#64748b', fontSize: '0.82rem' }}>{sortIndicator('name')}</span>
            </button>
            <button type="button" onClick={() => handleSort('email')} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>E-mail</span><span style={{ color: '#64748b', fontSize: '0.82rem' }}>{sortIndicator('email')}</span>
            </button>
            <button type="button" onClick={() => handleSort('role')} style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>Role</span><span style={{ color: '#64748b', fontSize: '0.82rem' }}>{sortIndicator('role')}</span>
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '20px', color: '#64748b' }}>A carregar utilizadores...</div>
          ) : ordenados.length === 0 ? (
            <div style={{ padding: '20px', color: '#64748b' }}>Nenhum utilizador encontrado.</div>
          ) : (
            paginados.map((u) => (
              <div
                key={u.id}
                style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1.4fr 180px', padding: '14px 18px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}
              >
                <span style={{ color: '#475569' }}>#{u.id}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 600 }}>
                  <UserCircle2 size={16} /> {u.name}
                </span>
                <span style={{ color: '#475569' }}>{u.email}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content', padding: '6px 10px', borderRadius: '999px', background: u.role === 'admin' ? '#ecfeff' : '#f8fafc', color: u.role === 'admin' ? '#0e7490' : '#475569', border: '1px solid #e2e8f0', fontWeight: 700, textTransform: 'lowercase' }}>
                  <ShieldCheck size={14} /> {u.role}
                </span>
              </div>
            ))
          )}
        </div>

        {!loading && ordenados.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Página {currentPage} de {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: currentPage === 1 ? '#f1f5f9' : '#fff', color: '#334155', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: currentPage === totalPages ? '#f1f5f9' : '#fff', color: '#334155', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Seguinte
              </button>
            </div>
          </div>
        )}
      </div>
    </RoleRoute>
  );
}
