'use client';
import React, { useState } from 'react';
import RoleRoute from '@/components/RoleRoute';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';

export default function InserirClube() {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [escudoFile, setEscudoFile] = useState(null);
  const [escudoPreview, setEscudoPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleEscudoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEscudoFile(file);
      setEscudoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let escudoUrl = null;

      if (escudoFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', escudoFile);
        formData.append('folder', 'clubes/escudos');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          alert(`Erro ao fazer upload do escudo: ${err.error || uploadRes.status}`);
          setUploading(false);
          return;
        }
        const uploadData = await uploadRes.json();
        escudoUrl = uploadData.url;
        setUploading(false);
      }

      const response = await fetch('/api/futebol/clubes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nome, escudo: escudoUrl }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao criar clube: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setNome('');
      setEscudoFile(null);
      setEscudoPreview('');
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao criar clube');
      console.error(error);
    }
  };

  return (
    <RoleRoute role="coordenador_futebol">
      <div className="backoffice-page">
        <h2>Inserir Clube</h2>
        <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Clube criado!" message="O clube foi inserido com sucesso." />
        <Toast show={showToast} type="success" message="Clube criado com sucesso!" onClose={() => setShowToast(false)} />
        <form className="backoffice-form" onSubmit={handleSubmit}>
          <section className="bo-section">
            <h3>Dados do Clube</h3>
            <label>
              Nome do Clube
              <input
                type="text"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Ex: Sporting CP"
              />
            </label>
            <label>
              Escudo do Clube
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleEscudoChange}
              />
            </label>
            {escudoPreview && (
              <img src={escudoPreview} alt="Pré-visualização do escudo" style={{ maxWidth: 120, marginTop: 8, borderRadius: 8 }} />
            )}
          </section>
          <button type="submit" disabled={uploading}>{uploading ? 'A carregar...' : 'Salvar Clube'}</button>
        </form>
      </div>
    </RoleRoute>
  );
}
