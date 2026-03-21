'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import '@/styles/Backoffice.css';

function Usuario() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [paroquias, setParoquias] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', paroquiaPreferida: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    Promise.all([
      fetch('/api/usuario', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/paroquias').then(res => res.json())
    ])
      .then(([userData, paroquiasData]) => {
        setUser(userData);
        setForm({ nome: userData.name || '', email: userData.email || '', paroquiaPreferida: '' });
        setParoquias(paroquiasData);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar dados.');
        setLoading(false);
      });
  }, []);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/usuario', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.nome, email: form.email })
      });
      if (!res.ok) throw new Error('Erro ao salvar dados');
      const updated = await res.json();
      setUser(updated);
      setForm({ nome: updated.name || '', email: updated.email || '', paroquiaPreferida: form.paroquiaPreferida });
      setSuccess('Dados salvos com sucesso!');
      setEditMode(false);
    } catch {
      setError('Erro ao salvar dados.');
    } finally {
      setSaving(false);
    }
  };

  const paroquiasFiltradas = paroquias.filter(p => {
    const nome = (p.nome || '').toLowerCase();
    return nome.includes(search.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <div className="backoffice-page">
          <h2 style={{ textAlign: 'center', color: '#2563eb', fontWeight: 900, fontSize: '2rem', marginBottom: 18 }}>Área do Utilizador</h2>
          {loading ? <p>Carregando...</p> : (
            <form className="backoffice-form" style={{ maxWidth: 400, margin: '0 auto' }} onSubmit={handleSave}>
              {error && <div style={{ color: '#e11d48', fontWeight: 700, marginBottom: 8 }}>{error}</div>}
              {success && <div style={{ color: '#2563eb', fontWeight: 700, marginBottom: 8 }}>{success}</div>}
              <label>
                Nome
                <input type="text" name="nome" value={form.nome} onChange={handleChange} disabled={!editMode || saving} />
              </label>
              <label>
                E-mail
                <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editMode || saving} />
              </label>
              <label>
                Paróquia de preferência
                <input type="text" placeholder="Pesquisar paróquia..." value={search} onChange={e => setSearch(e.target.value)} disabled={!editMode || saving} style={{ marginBottom: 8 }} />
                <select name="paroquiaPreferida" value={form.paroquiaPreferida} onChange={handleChange} disabled={!editMode || saving}>
                  <option value="">Selecione...</option>
                  {paroquiasFiltradas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </label>
              {editMode ? (
                <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
              ) : (
                <button type="button" onClick={() => setEditMode(true)}>Editar</button>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Usuario;
