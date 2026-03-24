'use client';
import React, { useState } from 'react';
import SuccessModal from '@/components/SuccessModal';
import Toast from '@/components/Toast';
import '@/styles/Backoffice.css';

interface ParoquiaForm {
  nome: string;
  rua: string;
  numero: string;
  codigoPostal: string;
  cidade: string;
  distrito: string;
  conselho: string;
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

interface GeoNamesResult {
  postalcodes?: Array<{ adminName1?: string; adminName2?: string }>;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

export default function InserirParoquia() {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const initialForm: ParoquiaForm = {
    nome: '', rua: '', numero: '', codigoPostal: '', cidade: '',
    distrito: '', conselho: '', lat: '', lng: '', telefone: '',
    email: '', descricao: '', site: '', imagem: '', facebook: '',
    instagram: '', whatsapp: '',
  };
  const [form, setForm] = useState<ParoquiaForm>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'codigoPostal' && e.target.value.replace('-', '').length >= 7) {
      buscarDistritoConselho(e.target.value);
    }
  };

  const buscarDistritoConselho = async (codigoPostal: string) => {
    try {
      const url = `https://api.geonames.org/postalCodeLookupJSON?postalcode=${codigoPostal}&country=PT&username=demo`;
      const response = await fetch(url);
      const data = (await response.json()) as GeoNamesResult;
      if (data?.postalcodes?.length && data.postalcodes.length > 0) {
        const info = data.postalcodes[0];
        setForm((prev) => ({ ...prev, distrito: info.adminName1 ?? '', conselho: info.adminName2 ?? '' }));
      }
    } catch {
      // silently ignore geolocation lookup errors
    }
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
      const data = (await response.json()) as NominatimResult[];
      if (data?.length > 0) {
        setForm((prev) => ({ ...prev, lat: data[0].lat, lng: data[0].lon }));
        alert('Localização encontrada!');
      } else {
        alert('Endereço não encontrado.');
      }
    } catch {
      alert('Erro ao buscar localização.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.codigoPostal} ${form.cidade}`;
      const payload = { ...form, endereco: enderecoCompleto, lat: String(form.lat), lng: String(form.lng) };
      const response = await fetch('/api/paroquias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao enviar paróquia: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
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
            <label>Distrito (preenchido automaticamente)<input type="text" name="distrito" value={form.distrito} readOnly /></label>
            <label>Conselho (preenchido automaticamente)<input type="text" name="conselho" value={form.conselho} readOnly /></label>
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
          <h3>Contatos &amp; Redes Sociais</h3>
          <label>Telefone<input type="text" name="telefone" value={form.telefone} onChange={handleChange} /></label>
          <label>E-mail<input type="email" name="email" value={form.email} onChange={handleChange} /></label>
          <label>Site<input type="url" name="site" value={form.site} onChange={handleChange} /></label>
          <label>Link da Imagem<input type="url" name="imagem" value={form.imagem} onChange={handleChange} /></label>
          <label>Facebook<input type="url" name="facebook" value={form.facebook} onChange={handleChange} /></label>
          <label>Instagram<input type="url" name="instagram" value={form.instagram} onChange={handleChange} /></label>
          <label>WhatsApp<input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} /></label>
        </section>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
