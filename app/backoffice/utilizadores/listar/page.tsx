'use client';
import React, { useEffect, useMemo, useState } from 'react';
import RoleRoute from '@/components/RoleRoute';
import AdminListRow from '@/components/AdminListRow';
import { ChevronLeft, ChevronRight, Search, ShieldCheck, UserCircle2 } from 'lucide-react';
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
  const itemsPerPage = 8;
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
  }, [searchTerm, roleFilter, sortKey, sortDirection]);

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
        <div className="bo-header">
          <div>
            <h2 className="bo-title" style={{ fontSize: '2rem', color: '#243B55', marginBottom: '0.4rem' }}>
              Utilizadores da Plataforma
            </h2>
            <p style={{ color: '#64748b', margin: 0 }}>Visível apenas para administradores.</p>
          </div>

          <div className="bo-toolbar">
            <div className="bo-search">
              <Search size={20} className="bo-search-icon" />
              <input
                type="text"
                placeholder="Pesquisar por nome, e-mail ou role..."
                className="bo-search-input"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as 'all' | 'admin' | 'user');
                setCurrentPage(1);
              }}
              className="bo-filter-select"
            >
              <option value="all">Todas as roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <p className="bo-summary">
          A mostrar {paginados.length} de {ordenados.length} utilizadores filtrados ({utilizadores.length} no total).
        </p>

        {error && (
          <div style={{ color: '#b91c1c', background: '#fee2e2', padding: '12px 14px', borderRadius: '10px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="bo-card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#334155' }}>
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
            <div className="bo-list" style={{ gap: '0', padding: '0.5rem' }}>
              {paginados.map((u) => (
                <AdminListRow
                  key={u.id}
                  title={u.name}
                  badge={(
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content', padding: '6px 10px', borderRadius: '999px', background: u.role === 'admin' ? '#ecfeff' : '#f8fafc', color: u.role === 'admin' ? '#0e7490' : '#475569', border: '1px solid #e2e8f0', fontWeight: 700, textTransform: 'lowercase', fontSize: '0.8rem' }}>
                      <ShieldCheck size={14} /> {u.role}
                    </span>
                  )}
                  subtitle={(
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 600 }}>
                        <UserCircle2 size={16} /> #{u.id}
                      </span>
                      <span style={{ color: '#475569' }}>{u.email}</span>
                    </span>
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {!loading && ordenados.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '3rem', paddingBottom: '3rem' }}>
            <button
              className="bo-btn bo-btn-light"
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={20} />
            </button>
            <span style={{ alignSelf: 'center', fontWeight: '700', color: '#243B55' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              className="bo-btn bo-btn-light"
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </RoleRoute>
  );
}
