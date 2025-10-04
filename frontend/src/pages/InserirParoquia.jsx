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
    <div className="backoffice-page">
      <h2>Inserir Paróquia</h2>
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
        maxWidth: 480,
        margin: '0 auto',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        padding: '32px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>
          Nome da Paróquia
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Descrição
          <textarea name="descricao" value={form.descricao} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', minHeight: 60 }} />
        </label>
        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Rua
          <input type="text" name="rua" value={form.rua || ''} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Número
          <input type="text" name="numero" value={form.numero || ''} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Código Postal
          <input type="text" name="codigoPostal" value={form.codigoPostal || ''} onChange={handleChange} required pattern="\d{4}-\d{3}" placeholder="1234-567" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Cidade/Localidade
          <input type="text" name="cidade" value={form.cidade || ''} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Distrito (preenchido automaticamente)
          <input type="text" name="distrito" value={form.distrito || ''} readOnly style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e7ef', background: '#f3f3f3', marginTop: 4, fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Conselho (preenchido automaticamente)
          <input type="text" name="conselho" value={form.conselho || ''} readOnly style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e7ef', background: '#f3f3f3', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <button type="button" style={{ padding: '4px 10px', fontSize: '0.95rem', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(37,99,235,0.08)' }} onClick={buscarLocalizacao}>Buscar localização</button>
          <label style={{ marginBottom: 0, fontWeight: 500, color: '#334155', fontSize: '1rem' }}>
            Latitude
            <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} required style={{ width: '120px', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginLeft: 4, fontSize: '1rem' }} />
          </label>
        </div>

        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Longitude
          <input type="number" step="any" name="lng" value={form.lng} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Telefone de Contato
          <input type="text" name="telefone" value={form.telefone} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        {/* removido campo Horário da Secretaria */}

        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          E-mail
          <input type="email" name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Site
          <input type="url" name="site" value={form.site} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Link da Imagem
          <input type="url" name="imagem" value={form.imagem} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Facebook
          <input type="url" name="facebook" value={form.facebook} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Instagram
          <input type="url" name="instagram" value={form.instagram} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          WhatsApp
          <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <button type="submit" style={{
          background: 'linear-gradient(90deg,#2563eb 60%,#7c3aed 100%)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '1.08rem',
          border: 'none',
          borderRadius: '10px',
          padding: '12px 0',
          marginTop: '12px',
          boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}>Salvar Paróquia</button>
      </form>
    </div>
  );
}
