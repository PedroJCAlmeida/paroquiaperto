'use client';
import React, { useState, useEffect } from 'react';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';

export default function InserirEvento() {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paroquias, setParoquias] = useState([]);
  const initialForm = { paroquiaId: '', titulo: '', data: '', hora: '', descricao: '' };
  const [form, setForm] = useState(initialForm);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/paroquias')
      .then(res => res.json())
      .then(data => setParoquias(data))
      .catch(() => setParoquias([]));
  }, []);

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
        formData.append('folder', 'eventos');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        setUploading(false);
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          alert(`Erro ao fazer upload da imagem: ${err.error || uploadRes.status}`);
          return;
        }
        const uploadData = await uploadRes.json();
        imagemUrl = uploadData.url;
      }

      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ paroquiaId: form.paroquiaId, titulo: form.titulo, data: form.data, hora: form.hora, descricao: form.descricao, imagem: imagemUrl }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao enviar evento: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
      setImagemFile(null);
      setImagemPreview('');
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao enviar evento');
      console.error(error);
    }
  };

  return (
    <div className="backoffice-page">
      <h2>Inserir Evento</h2>
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Obrigado pela colaboração!" message="Evento enviado com sucesso." />
      <Toast show={showToast} type="success" message="Evento enviado com sucesso!" onClose={() => setShowToast(false)} />
      <form className="backoffice-form" onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '32px 18px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Paróquia
          <select name="paroquiaId" value={form.paroquiaId} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }}>
            <option value="">Selecione uma paróquia</option>
            {paroquias.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Título do Evento
          <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Data
          <input type="date" name="data" value={form.data} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Hora
          <input type="time" name="hora" value={form.hora} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Descrição
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4} placeholder="Detalhes sobre o evento..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', minHeight: 60 }} />
        </label>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem' }}>
          Imagem (opcional)
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImagemChange} style={{ width: '100%', marginTop: 4, fontSize: '1rem' }} />
        </label>
        {imagemPreview && (
          <img src={imagemPreview} alt="Pré-visualização" style={{ maxWidth: 120, borderRadius: 8 }} />
        )}
        <button type="submit" disabled={uploading} style={{ background: 'linear-gradient(90deg,#2563eb 60%,#7c3aed 100%)', color: '#fff', fontWeight: 600, fontSize: '1.08rem', border: 'none', borderRadius: '10px', padding: '12px 0', cursor: 'pointer' }}>{uploading ? 'A carregar imagem...' : 'Salvar Evento'}</button>
      </form>
    </div>
  );
}
