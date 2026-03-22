'use client';
import React, { useState } from 'react';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';

export default function InserirParoquia() {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const initialForm = {
    nome: '', rua: '', numero: '', codigoPostal: '', cidade: '',
    distrito: '', conselho: '', lat: '', lng: '', telefone: '',
    email: '', descricao: '', site: '', facebook: '',
    instagram: '', whatsapp: '',
  };
  const [form, setForm] = useState(initialForm);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'codigoPostal' && e.target.value.replace('-', '').length >= 7) {
      buscarDistritoConselho(e.target.value);
    }
  };

  const buscarDistritoConselho = async (codigoPostal) => {
    try {
      const url = `https://api.geonames.org/postalCodeLookupJSON?postalcode=${codigoPostal}&country=PT&username=demo`;
      const response = await fetch(url);
      const data = await response.json();
      if (data?.postalcodes?.length > 0) {
        const info = data.postalcodes[0];
        setForm(prev => ({ ...prev, distrito: info.adminName1 || '', conselho: info.adminName2 || '' }));
      }
    } catch {}
  };

  const buscarLocalizacao = async () => {
    const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.codigoPostal} ${form.cidade}`;
    if (!form.rua || !form.numero || !form.codigoPostal || !form.cidade) {
      alert('Preencha todos os campos de endereço para buscar localização.');
      return;
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data?.length > 0) {
        setForm(prev => ({ ...prev, lat: data[0].lat, lng: data[0].lon }));
        alert('Localização encontrada!');
      } else {
        alert('Endereço não encontrado.');
      }
    } catch {
      alert('Erro ao buscar localização.');
    }
  };

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
      let imagemUrl = form.imagem || null;

      if (imagemFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', imagemFile);
        formData.append('folder', 'paroquias');
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

      const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.codigoPostal} ${form.cidade}`;
      const payload = { ...form, imagem: imagemUrl, endereco: enderecoCompleto, lat: String(form.lat), lng: String(form.lng) };
      const response = await fetch('/api/paroquias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao enviar paróquia: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
      setImagemFile(null);
      setImagemPreview('');
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
            <label>Rua<input type="text" name="rua" value={form.rua || ''} onChange={handleChange} required /></label>
            <label>Número<input type="text" name="numero" value={form.numero || ''} onChange={handleChange} required /></label>
            <label>Código Postal<input type="text" name="codigoPostal" value={form.codigoPostal || ''} onChange={handleChange} required pattern="\d{4}-\d{3}" placeholder="1234-567" /></label>
            <label>Cidade/Localidade<input type="text" name="cidade" value={form.cidade || ''} onChange={handleChange} required /></label>
            <label>Distrito (preenchido automaticamente)<input type="text" name="distrito" value={form.distrito || ''} readOnly /></label>
            <label>Conselho (preenchido automaticamente)<input type="text" name="conselho" value={form.conselho || ''} readOnly /></label>
          </div>
        </section>
        <section className="bo-section">
          <h3 className="bo-h3-amber">Localização</h3>
          <div className="bo-actions">
            <button type="button" className="bo-btn-secondary" onClick={buscarLocalizacao}>Buscar localização</button>
          </div>
          <div className="bo-latlng">
            <label>Latitude<input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} required /></label>
            <label>Longitude<input type="number" step="any" name="lng" value={form.lng} onChange={handleChange} required /></label>
          </div>
        </section>
        <section className="bo-section">
          <h3>Contatos & Redes Sociais</h3>
          <label>Telefone<input type="text" name="telefone" value={form.telefone} onChange={handleChange} /></label>
          <label>E-mail<input type="email" name="email" value={form.email} onChange={handleChange} /></label>
          <label>Site<input type="url" name="site" value={form.site} onChange={handleChange} /></label>
          <label>
            Imagem
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImagemChange} />
          </label>
          {imagemPreview && (
            <img src={imagemPreview} alt="Pré-visualização" style={{ maxWidth: 120, marginTop: 4, marginBottom: 8, borderRadius: 8 }} />
          )}
          <label>Facebook<input type="url" name="facebook" value={form.facebook} onChange={handleChange} /></label>
          <label>Instagram<input type="url" name="instagram" value={form.instagram} onChange={handleChange} /></label>
          <label>WhatsApp<input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} /></label>
        </section>
        <button type="submit" disabled={uploading}>{uploading ? 'A carregar imagem...' : 'Salvar'}</button>
      </form>
    </div>
  );
}
