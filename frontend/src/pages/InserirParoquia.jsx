// InserirParoquia.jsx
import React, { useState } from 'react';
import SuccessModal from '../components/SuccessModal';
import Toast from '../components/Toast';
import '../styles/Backoffice.css';

export default function InserirParoquia() {
  // ...existing code...
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const initialForm = {
    nome: '',
    endereco: '',
    lat: '',
    lng: '',
    telefone: '',
    email: '',
    descricao: '',
    site: '',
    imagem: '',
    facebook: '',
    instagram: '',
    whatsapp: '',
  };
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'codigoPostal' && e.target.value.length >= 8) {
      buscarDistritoConselho(e.target.value);
    }
  };

  const buscarDistritoConselho = async (codigoPostal) => {
    try {
      const url = `http://api.geonames.org/postalCodeLookupJSON?postalcode=${codigoPostal}&country=PT&username=demo`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.postalcodes && data.postalcodes.length > 0) {
        const info = data.postalcodes[0];
        setForm(prev => ({
          ...prev,
          distrito: info.adminName1 || '',
          conselho: info.adminName2 || ''
        }));
      }
    } catch (error) {}
  };

  const buscarLocalizacao = async () => {
    // Monta o endereço completo a partir dos campos separados
    const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.codigoPostal} ${form.cidade}`;
    if (!form.rua || !form.numero || !form.codigoPostal || !form.cidade) {
      alert('Preencha todos os campos de endereço para buscar localização.');
      return;
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        setForm(prev => ({
          ...prev,
          lat: data[0].lat,
          lng: data[0].lon
        }));
        alert('Localização encontrada!');
      } else {
        alert('Endereço não encontrado.');
      }
    } catch (error) {
      alert('Erro ao buscar localização.');
    }
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    try {
      const token = localStorage.getItem('token');
      // Monta o endereço completo para o backend
      const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.codigoPostal} ${form.cidade}`;
      const payload = {
        ...form,
        endereco: enderecoCompleto,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng)
      };
      const response = await fetch(`${apiUrl}/api/paroquias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao enviar paróquia: ${response.status} ${errorText}`);
        return;
      }

  await response.json();
  setForm(initialForm); // Limpa os campos
  setSuccess("");
  setShowModal(true); // Exibe modal de agradecimento
  setShowToast(true); // Exibe toast de sucesso
    } catch (error) {
      alert('Erro ao enviar paróquia');
      console.error(error);
    }
  };

  return (
    <div className="backoffice-page" style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(120deg,#f8fafc 0%,#e0e7ff 100%)',
      padding: 0,
      margin: 0,
    }}>
      <h2 style={{ textAlign: 'center', color: '#2563eb', fontWeight: 900, fontSize: '2rem', marginBottom: 18, letterSpacing: '1px' }}>Inserir Paróquia</h2>
      <SuccessModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Obrigado pela colaboração!"
        message="Sua paróquia foi enviada com sucesso."
      />
      <Toast
        show={showToast}
        type="success"
        message="Paróquia enviada com sucesso!"
        onClose={() => setShowToast(false)}
      />
      <form className="backoffice-form" onSubmit={handleSubmit} style={{
        maxWidth: 400,
        width: '100%',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        padding: '32px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        margin: 0,
      }}>
          <div style={{ width: '100%', marginBottom: 8 }}>
            <h3 style={{ textAlign: 'center', color: '#2563eb', fontWeight: 900, fontSize: '1.35rem', marginBottom: 12, letterSpacing: '1px' }}>Dados Básicos</h3>
            <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2" style={{marginRight:4}}><circle cx="11" cy="11" r="10"/><path d="M11 7v4l3 2"/></svg>
              Nome da Paróquia
              <input type="text" name="nome" value={form.nome} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #a5b4fc', marginTop: 4, fontSize: '1rem', background: '#f8fafc', boxShadow: '0 2px 10px rgba(60,60,120,0.09)' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Descrição
              <textarea name="descricao" value={form.descricao} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #a5b4fc', marginTop: 4, fontSize: '1rem', minHeight: 60, background: '#f8fafc' }} />
            </label>
          </div>
          <div style={{ width: '100%', marginBottom: 8 }}>
            <h3 style={{ textAlign: 'center', color: '#7c3aed', fontWeight: 900, fontSize: '1.18rem', marginBottom: 10, letterSpacing: '0.5px' }}>Endereço</h3>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="20" height="20" fill="none" stroke="#7c3aed" strokeWidth="2" style={{marginRight:4}}><rect x="3" y="7" width="14" height="10" rx="2"/><path d="M8 11h4"/></svg>
              Rua
              <input type="text" name="rua" value={form.rua || ''} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #a5b4fc', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Número
              <input type="text" name="numero" value={form.numero || ''} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #a5b4fc', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Código Postal
              <input type="text" name="codigoPostal" value={form.codigoPostal || ''} onChange={handleChange} required pattern="\d{4}-\d{3}" placeholder="1234-567" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #a5b4fc', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Cidade/Localidade
              <input type="text" name="cidade" value={form.cidade || ''} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #a5b4fc', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Distrito (preenchido automaticamente)
              <input type="text" name="distrito" value={form.distrito || ''} readOnly style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e7ef', background: '#f3f3f3', marginTop: 4, fontSize: '1rem' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Conselho (preenchido automaticamente)
              <input type="text" name="conselho" value={form.conselho || ''} readOnly style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e0e7ef', background: '#f3f3f3', marginTop: 4, fontSize: '1rem' }} />
            </label>
          </div>
          <div style={{ width: '100%', marginBottom: 8 }}>
            <h3 style={{ textAlign: 'center', color: '#fbbf24', fontWeight: 900, fontSize: '1.18rem', marginBottom: 10, letterSpacing: '0.5px' }}>Localização</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <button type="button" style={{ padding: '6px 14px', fontSize: '1rem', borderRadius: '8px', background: 'linear-gradient(90deg,#2563eb 60%,#7c3aed 100%)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(37,99,235,0.08)', fontWeight: 700, transition: 'background 0.2s' }} onClick={buscarLocalizacao}>Buscar localização</button>
              <label style={{ marginBottom: 0, fontWeight: 500, color: '#334155', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="18" height="18" fill="none" stroke="#fbbf24" strokeWidth="2" style={{marginRight:2}}><circle cx="9" cy="9" r="8"/><path d="M9 5v4l3 2"/></svg>
                Latitude
                <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} required style={{ width: '100px', padding: '8px', borderRadius: '8px', border: '2px solid #fbbf24', marginLeft: 4, fontSize: '1rem', background: '#f8fafc' }} />
              </label>
              <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="18" height="18" fill="none" stroke="#fbbf24" strokeWidth="2" style={{marginRight:2}}><circle cx="9" cy="9" r="8"/><path d="M9 5v4l3 2"/></svg>
                Longitude
                <input type="number" step="any" name="lng" value={form.lng} onChange={handleChange} required style={{ width: '100px', padding: '8px', borderRadius: '8px', border: '2px solid #fbbf24', marginLeft: 4, fontSize: '1rem', background: '#f8fafc' }} />
              </label>
            </div>
          </div>
          <div style={{ width: '100%', marginBottom: 8 }}>
            <h3 style={{ textAlign: 'center', color: '#334155', fontWeight: 900, fontSize: '1.18rem', marginBottom: 10, letterSpacing: '0.5px' }}>Contatos & Redes Sociais</h3>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Telefone de Contato
              <input type="text" name="telefone" value={form.telefone} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              E-mail
              <input type="email" name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Site
              <input type="url" name="site" value={form.site} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Link da Imagem
              <input type="url" name="imagem" value={form.imagem} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Facebook
              <input type="url" name="facebook" value={form.facebook} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              Instagram
              <input type="url" name="instagram" value={form.instagram} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
            <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
              WhatsApp
              <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }} />
            </label>
          </div>
          <button type="submit" style={{
            background: 'linear-gradient(90deg,#2563eb 60%,#7c3aed 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.15rem',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 0',
            marginTop: '18px',
            boxShadow: '0 2px 14px rgba(99,102,241,0.15)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}>Salvar</button>
        </form>
    </div>
  );
}
