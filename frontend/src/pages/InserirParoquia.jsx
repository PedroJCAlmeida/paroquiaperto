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
      <form className="backoffice-form" onSubmit={handleSubmit}>
        <label>
          Nome da Paróquia
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
        </label>

        <label>
          Descrição
          <textarea name="descricao" value={form.descricao} onChange={handleChange} />
        </label>
        <label>
          Rua
          <input type="text" name="rua" value={form.rua || ''} onChange={handleChange} required />
        </label>
        <label>
          Número
          <input type="text" name="numero" value={form.numero || ''} onChange={handleChange} required />
        </label>
        <label>
          Código Postal
          <input type="text" name="codigoPostal" value={form.codigoPostal || ''} onChange={handleChange} required pattern="\d{4}-\d{3}" placeholder="1234-567" />
        </label>
        <label>
          Cidade/Localidade
          <input type="text" name="cidade" value={form.cidade || ''} onChange={handleChange} required />
        </label>
        <label>
          Distrito (preenchido automaticamente)
          <input type="text" name="distrito" value={form.distrito || ''} readOnly style={{ background: '#f3f3f3' }} />
        </label>
        <label>
          Conselho (preenchido automaticamente)
          <input type="text" name="conselho" value={form.conselho || ''} readOnly style={{ background: '#f3f3f3' }} />
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <button type="button" style={{ padding: '4px 10px', fontSize: '0.95rem', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={buscarLocalizacao}>Buscar localização</button>
          <label style={{ marginBottom: 0 }}>
            Latitude
            <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Longitude
          <input type="number" step="any" name="lng" value={form.lng} onChange={handleChange} required />
        </label>

        <label>
          Telefone de Contato
          <input type="text" name="telefone" value={form.telefone} onChange={handleChange} />
        </label>

        {/* removido campo Horário da Secretaria */}

        <label>
          E-mail
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>

        <label>
          Site
          <input type="url" name="site" value={form.site} onChange={handleChange} />
        </label>

        <label>
          Link da Imagem
          <input type="url" name="imagem" value={form.imagem} onChange={handleChange} />
        </label>

        <label>
          Facebook
          <input type="url" name="facebook" value={form.facebook} onChange={handleChange} />
        </label>

        <label>
          Instagram
          <input type="url" name="instagram" value={form.instagram} onChange={handleChange} />
        </label>

        <label>
          WhatsApp
          <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} />
        </label>

        <button type="submit">Salvar Paróquia</button>
      </form>
    </div>
  );
}
