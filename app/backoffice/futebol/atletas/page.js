'use client';
import React, { useState, useEffect } from 'react';
import RoleRoute from '@/components/RoleRoute';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';

export default function InserirAtleta() {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clubes, setClubes] = useState([]);
  const [escaloes, setEscaloes] = useState([]);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const initialForm = { nome: '', posicao: '', numero: '', clubeId: '', escalaoId: '' };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetch('/api/futebol/clubes')
      .then(res => res.json())
      .then(data => setClubes(Array.isArray(data) ? data : []))
      .catch(() => setClubes([]));
  }, []);

  useEffect(() => {
    if (form.clubeId) {
      fetch('/api/futebol/escaloes')
        .then(res => res.json())
        .then(data => {
          const filtered = Array.isArray(data) ? data.filter(e => String(e.clubeId) === String(form.clubeId)) : [];
          setEscaloes(filtered);
        })
        .catch(() => setEscaloes([]));
    } else {
      setEscaloes([]);
    }
  }, [form.clubeId]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemFile(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let imagemUrl = null;

      if (imagemFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', imagemFile);
        formData.append('folder', 'futebol/atletas');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          alert(`Erro ao fazer upload da imagem: ${err.error || uploadRes.status}`);
          setUploading(false);
          return;
        }
        const uploadData = await uploadRes.json();
        imagemUrl = uploadData.url;
        setUploading(false);
      }

      const response = await fetch('/api/futebol/atletas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          nome: form.nome,
          posicao: form.posicao || null,
          numero: form.numero || null,
          clubeId: form.clubeId,
          escalaoId: form.escalaoId || null,
          imagem: imagemUrl,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao criar atleta: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
      setImagemFile(null);
      setImagemPreview('');
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao criar atleta');
      console.error(error);
    }
  };

  return (
    <RoleRoute role="coordenador_futebol">
      <div className="backoffice-page">
        <h2>Inserir Atleta</h2>
        <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Atleta criado!" message="O atleta foi inserido com sucesso." />
        <Toast show={showToast} type="success" message="Atleta criado com sucesso!" onClose={() => setShowToast(false)} />
        <form className="backoffice-form" onSubmit={handleSubmit}>
          <section className="bo-section">
            <h3>Dados do Atleta</h3>
            <label>
              Nome do Atleta
              <input type="text" name="nome" value={form.nome} onChange={handleChange} required placeholder="Ex: João Silva" />
            </label>
            <label>
              Posição
              <input type="text" name="posicao" value={form.posicao} onChange={handleChange} placeholder="Ex: Avançado, Guarda-Redes" />
            </label>
            <label>
              Número de Camisola
              <input type="number" name="numero" value={form.numero} onChange={handleChange} min="1" max="99" placeholder="Ex: 10" />
            </label>
            <label>
              Clube
              <select name="clubeId" value={form.clubeId} onChange={handleChange} required>
                <option value="">Selecione um clube</option>
                {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </label>
            <label>
              Escalão
              <select name="escalaoId" value={form.escalaoId} onChange={handleChange} disabled={!form.clubeId}>
                <option value="">Selecione um escalão (opcional)</option>
                {escaloes.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
            </label>
            <label>
              Foto do Atleta
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImagemChange}
              />
            </label>
            {imagemPreview && (
              <img src={imagemPreview} alt="Pré-visualização" style={{ maxWidth: 120, marginTop: 8, borderRadius: 8 }} />
            )}
          </section>
          <button type="submit" disabled={uploading}>{uploading ? 'A carregar...' : 'Salvar Atleta'}</button>
        </form>
      </div>
    </RoleRoute>
  );
}
