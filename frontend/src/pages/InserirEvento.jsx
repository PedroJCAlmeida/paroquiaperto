// InserirEvento.jsx
import React, { useState, useEffect } from 'react';
import SuccessModal from '../components/SuccessModal';
import Toast from '../components/Toast';
import '../styles/Backoffice.css';


export default function InserirEvento() {
  const [showToast, setShowToast] = useState(false);
  const [paroquias, setParoquias] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const fetchParoquias = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/paroquias`);
        const data = await res.json();
        setParoquias(data);
      } catch (err) {
        setParoquias([]);
      }
    };
    fetchParoquias();
  }, []);
  const initialForm = {
    paroquiaId: '',
    titulo: '',
    data: '',
    hora: '',
    descricao: '',
    imagem: '',
  };
  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        paroquia: { id: parseInt(form.paroquiaId) }
      };
      const response = await fetch(`${apiUrl}/api/eventos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao enviar evento: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
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
      <SuccessModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Obrigado pela colaboração!"
        message="Evento enviado com sucesso."
      />
      <Toast
        show={showToast}
        type="success"
        message="Evento enviado com sucesso!"
        onClose={() => setShowToast(false)}
      />
      <form className="backoffice-form" onSubmit={handleSubmit}>
        <label>
          Paróquia
          <select name="paroquiaId" value={form.paroquiaId} onChange={handleChange} required>
            <option value="">Selecione uma paróquia</option>
            {paroquias.map(p => (
              <option key={p.id} value={p.id}>{p.nomeIgreja || p.nome}</option>
            ))}
          </select>
        </label>

        <label>
          Título do Evento
          <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required />
        </label>

        <label>
          Data
          <input type="date" name="data" value={form.data} onChange={handleChange} required />
        </label>

        <label>
          Hora
          <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
        </label>

        <label>
          Descrição
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4} placeholder="Detalhes sobre o evento..." />
        </label>

        <label>
          Link da Imagem (opcional)
          <input type="url" name="imagem" value={form.imagem} onChange={handleChange} />
        </label>

        <button type="submit">Salvar Evento</button>
      </form>
    </div>
  );
}
