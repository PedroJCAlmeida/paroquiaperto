// InserirHorario.jsx
import React, { useState, useEffect } from 'react';
import SuccessModal from '../components/SuccessModal';
import Toast from '../components/Toast';
import '../styles/Backoffice.css';


export default function InserirHorario() {
  const [showToast, setShowToast] = useState(false);
  const initialForm = {
    paroquiaId: '',
    diaSemana: '',
    hora: '',
    tipo: 'Missa',
  };
  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);

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
        paroquiaId: parseInt(form.paroquiaId)
      };
      const response = await fetch(`${apiUrl}/api/horarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao enviar horário: ${response.status} ${errorText}`);
        return;
      }
      await response.json();
      setForm(initialForm);
  setShowModal(true);
  setShowToast(true);
    } catch (error) {
      alert('Erro ao enviar horário');
      console.error(error);
    }
  };

  return (
    <div className="backoffice-page">
      <h2>Inserir Horário de Missa</h2>
      <SuccessModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Obrigado pela colaboração!"
        message="Horário enviado com sucesso."
      />
      <Toast
        show={showToast}
        type="success"
        message="Horário enviado com sucesso!"
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
          Dia da Semana
          <select name="diaSemana" value={form.diaSemana} onChange={handleChange} required>
            <option value="">Selecione um dia</option>
            <option value="Domingo">Domingo</option>
            <option value="Segunda">Segunda</option>
            <option value="Terça">Terça</option>
            <option value="Quarta">Quarta</option>
            <option value="Quinta">Quinta</option>
            <option value="Sexta">Sexta</option>
            <option value="Sábado">Sábado</option>
          </select>
        </label>

        <label>
          Hora
          <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
        </label>

        <label>
          Tipo
          <select name="tipo" value={form.tipo} onChange={handleChange} required>
            <option value="Missa">Missa</option>
            <option value="Confissão">Confissão</option>
            <option value="Adoração">Adoração</option>
            <option value="Outros">Outros</option>
          </select>
        </label>

        <button type="submit">Salvar Horário</button>
      </form>
    </div>
  );
}
