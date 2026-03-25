'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';
import type { Distrito, Conselho } from '@/types';

interface ParoquiaForm {
  nome: string;
  rua: string;
  numero: string;
  codigoPostal: string;
  cidade: string;
  distritoId: string;
  conselhoId: string;
  lat: string;
  lng: string;
  telefone: string;
  email: string;
  descricao: string;
  site: string;
  imagem: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

export default function InserirParoquia() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const [uploadingImagem, setUploadingImagem] = useState(false);
  const initialForm: ParoquiaForm = {
    nome: '', rua: '', numero: '', codigoPostal: '', cidade: '',
    distritoId: '', conselhoId: '', lat: '', lng: '', telefone: '',
    email: '', descricao: '', site: '', imagem: '', facebook: '',
    instagram: '', whatsapp: '',
  };
  const [form, setForm] = useState<ParoquiaForm>(initialForm);

  useEffect(() => {
    fetch('/api/distritos')
      .then((res) => res.json())
      .then((data: Distrito[]) => setDistritos(Array.isArray(data) ? data : []))
      .catch(() => setDistritos([]));
  }, []);

  useEffect(() => {
    if (!form.distritoId) {
      setConselhos([]);
      return;
    }
    fetch(`/api/conselhos?distritoId=${form.distritoId}`)
      .then((res) => res.json())
      .then((data: Conselho[]) => setConselhos(Array.isArray(data) ? data : []))
      .catch(() => setConselhos([]));
  }, [form.distritoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'distritoId' ? { conselhoId: '' } : {}),
    }));
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagemFile(file);
    setImagemPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : '';
    });
  };

  React.useEffect(() => {
    return () => {
      if (imagemPreview) URL.revokeObjectURL(imagemPreview);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buscarLocalizacao = async () => {
    if (!form.rua || !form.numero || !form.codigoPostal || !form.cidade) {
      alert('Preencha todos os campos de endereço para buscar localização.');
      return;
    }
    const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.codigoPostal} ${form.cidade}`;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`;
      const response = await fetch(url);
      const data = (await response.json()) as NominatimResult[];
      if (data?.length > 0) {
        setForm((prev) => ({ ...prev, lat: data[0].lat, lng: data[0].lon }));
        alert('Localização encontrada!');
      } else {
        alert('Endereço não encontrado. Tente um endereço mais genérico ou verifique os dados.');
      }
    } catch {
      alert('Erro ao buscar localização.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.lat || !form.lng) {
      alert('Clique em "Buscar localização" para obter as coordenadas antes de guardar.');
      return;
    }
    try {
      const token = localStorage.getItem('token');

      let imagemUrl = form.imagem;
      if (imagemFile) {
        setUploadingImagem(true);
        const uploadData = new FormData();
        uploadData.append('file', imagemFile);
        uploadData.append('folder', 'paroquiaperto/paroquias');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });
        setUploadingImagem(false);
        if (!uploadRes.ok) {
          const err = await uploadRes.json() as { error?: string };
          alert(`Erro ao fazer upload da imagem: ${err.error ?? uploadRes.status}`);
          return;
        }
        const { url } = await uploadRes.json() as { url: string };
        imagemUrl = url;
      }

      const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.codigoPostal} ${form.cidade}`;
      const payload = {
        nome: form.nome,
        endereco: enderecoCompleto,
        lat: form.lat,
        lng: form.lng,
        telefone: form.telefone,
        email: form.email,
        descricao: form.descricao,
        site: form.site,
        imagem: imagemUrl,
        facebook: form.facebook,
        instagram: form.instagram,
        whatsapp: form.whatsapp,
        ...(form.distritoId ? { distritoId: parseInt(form.distritoId, 10) } : {}),
        ...(form.conselhoId ? { conselhoId: parseInt(form.conselhoId, 10) } : {}),
      };
      const response = await fetch('/api/paroquias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.replace('/login');
          return;
        }
        const errorText = await response.text();
        alert(`Erro ao enviar paróquia: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
      setImagemFile(null);
      setImagemPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return ''; });
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      alert('Erro ao enviar paróquia');
      console.error(error);
    }
  };

  return (
    <div className="backoffice-page">
      <h2>Inserir Paróquia</h2>
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Obrigado pela colaboração!" message="Sua paróquia foi enviada com sucesso." />
      <Toast show={showToast} type="success" message="Paróquia enviada com sucesso!" onClose={() => setShowToast(false)} />
      <form className="backoffice-form" onSubmit={handleSubmit}>
        <section className="bo-section">
          <h3>Dados Básicos</h3>
          <label>
            Nome da Paróquia
            <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
          </label>
          <label>
            Descrição
            <textarea name="descricao" value={form.descricao} onChange={handleChange} />
          </label>
        </section>
        <section className="bo-section">
          <h3 className="bo-h3-purple">Endereço</h3>
          <div className="bo-grid-2">
            <label>Rua<input type="text" name="rua" value={form.rua} onChange={handleChange} required /></label>
            <label>Número<input type="text" name="numero" value={form.numero} onChange={handleChange} required /></label>
            <label>Código Postal<input type="text" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} required pattern="\d{4}-\d{3}" placeholder="1234-567" /></label>
            <label>Cidade/Localidade<input type="text" name="cidade" value={form.cidade} onChange={handleChange} required /></label>
            <label>
              Distrito
              <select name="distritoId" value={form.distritoId} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f8fafc' }}>
                <option value="">Selecione um distrito</option>
                {distritos.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
              </select>
            </label>
            <label>
              Conselho
              <select name="conselhoId" value={form.conselhoId} onChange={handleChange} disabled={!form.distritoId} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', background: form.distritoId ? '#f8fafc' : '#f1f5f9' }}>
                <option value="">Selecione um conselho</option>
                {conselhos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </label>
          </div>
        </section>
        <section className="bo-section">
          <h3 className="bo-h3-amber">Localização</h3>
          <div className="bo-actions">
            <button type="button" className="bo-btn-secondary" onClick={buscarLocalizacao}>Buscar localização</button>
          </div>
          <div className="bo-latlng">
            <label>
              Latitude
              <input type="text" name="lat" value={form.lat} readOnly placeholder="Preenchido automaticamente" style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </label>
            <label>
              Longitude
              <input type="text" name="lng" value={form.lng} readOnly placeholder="Preenchido automaticamente" style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </label>
          </div>
          {!form.lat && !form.lng && (
            <p style={{ color: '#f59e0b', fontSize: '0.88rem', marginTop: 6 }}>
              ⚠ Clique em &ldquo;Buscar localização&rdquo; após preencher o endereço para obter as coordenadas.
            </p>
          )}
        </section>
        <section className="bo-section">
          <h3>Contatos &amp; Redes Sociais</h3>
          <label>Telefone<input type="text" name="telefone" value={form.telefone} onChange={handleChange} /></label>
          <label>E-mail<input type="email" name="email" value={form.email} onChange={handleChange} /></label>
          <label>Site<input type="url" name="site" value={form.site} onChange={handleChange} /></label>
          <label>
            Imagem
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImagemChange}
            />
            {imagemPreview && (
              <img
                src={imagemPreview}
                alt="Pré-visualização"
                style={{ marginTop: 8, maxWidth: '100%', maxHeight: 180, borderRadius: 8, objectFit: 'cover' }}
              />
            )}
            {uploadingImagem && <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>A fazer upload...</p>}
          </label>
          <label>Facebook<input type="url" name="facebook" value={form.facebook} onChange={handleChange} /></label>
          <label>Instagram<input type="url" name="instagram" value={form.instagram} onChange={handleChange} /></label>
          <label>WhatsApp<input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} /></label>
        </section>
        <button type="submit" disabled={uploadingImagem}>
          {uploadingImagem ? 'A fazer upload...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
