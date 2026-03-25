'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/Backoffice.css';
import type { Paroquia, UserProfile } from '@/types';

interface UserForm {
  nome: string;
  email: string;
  paroquiaPreferida: string;
}

function Usuario() {
  const [user, setUser] = useState<UserProfile>({ id: 0, name: '', email: '' });
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<UserForm>({ nome: '', email: '', paroquiaPreferida: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    Promise.all([
      fetch('/api/usuario', { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
        res.json(),
      ),
      fetch('/api/paroquias').then((res) => res.json()),
    ])
      .then(([userData, paroquiasData]: [UserProfile, Paroquia[]]) => {
        setUser(userData);
        setForm({ nome: userData.name ?? '', email: userData.email ?? '', paroquiaPreferida: '' });
        if (userData.image) setImagePreview(userData.image);
        setParoquias(paroquiasData);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar dados.');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview((prev) => {
        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
    }
  };

  React.useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        setUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        uploadData.append('folder', 'paroquiaperto/perfis');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });
        setUploadingImage(false);
        if (!uploadRes.ok) {
          const err = await uploadRes.json() as { error?: string };
          throw new Error(err.error ?? 'Erro ao fazer upload da imagem');
        }
        const { url } = await uploadRes.json() as { url: string };
        imageUrl = url;
      }

      const res = await fetch('/api/usuario', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.nome, email: form.email, ...(imageUrl !== undefined && { image: imageUrl }) }),
      });
      if (!res.ok) throw new Error('Erro ao salvar dados');
      const updated = (await res.json()) as UserProfile;
      setUser(updated);
      setForm({ nome: updated.name ?? '', email: updated.email ?? '', paroquiaPreferida: form.paroquiaPreferida });
      if (updated.image) {
        setImagePreview((prev) => { if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev); return updated.image!; });
      }
      setImageFile(null);
      setSuccess('Dados salvos com sucesso!');
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados.');
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  const paroquiasFiltradas = paroquias.filter((p) =>
    (p.nome ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <div className="backoffice-page">
          <h2 style={{ textAlign: 'center', color: '#243B55', fontWeight: 900, fontSize: '2rem', marginBottom: 18 }}>
            Área do Utilizador
          </h2>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <form className="backoffice-form" style={{ maxWidth: 400, margin: '0 auto' }} onSubmit={handleSave}>
              {error && <div style={{ color: '#e11d48', fontWeight: 700, marginBottom: 8 }}>{error}</div>}
              {success && <div style={{ color: '#243B55', fontWeight: 700, marginBottom: 8 }}>{success}</div>}
              <label>
                Foto de perfil
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Foto de perfil"
                      style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #cbd5e1' }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    disabled={!editMode || saving}
                  />
                </div>
                {uploadingImage && <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>A fazer upload...</p>}
              </label>
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
                <input
                  type="text"
                  placeholder="Pesquisar paróquia..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={!editMode || saving}
                  style={{ marginBottom: 8 }}
                />
                <select
                  name="paroquiaPreferida"
                  value={form.paroquiaPreferida}
                  onChange={handleChange}
                  disabled={!editMode || saving}
                >
                  <option value="">Selecione...</option>
                  {paroquiasFiltradas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </label>
              {editMode ? (
                <button type="submit" disabled={saving || uploadingImage}>
                  {saving || uploadingImage ? 'Salvando...' : 'Salvar'}
                </button>
              ) : (
                <button type="button" onClick={() => setEditMode(true)}>
                  Editar
                </button>
              )}
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Usuario;

