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
        paroquia: { id: parseInt(form.paroquiaId) }
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
      <form className="backoffice-form" onSubmit={handleSubmit} style={{
        maxWidth: 400,
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
          Paróquia
          <select name="paroquiaId" value={form.paroquiaId} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }}>
            <option value="">Selecione uma paróquia</option>
            {paroquias.map(p => (
              <option key={p.id} value={p.id}>{p.nomeIgreja || p.nome}</option>
            ))}
          </select>
        </label>

        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>
          Dia da Semana
          <select name="diaSemana" value={form.diaSemana} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }}>
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

        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>
          Hora
          <input type="time" name="hora" value={form.hora} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }} />
        </label>

        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>
          Tipo
          <select name="tipo" value={form.tipo} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem', background: '#f8fafc' }}>
            <option value="Missa">Missa</option>
            <option value="Confissão">Confissão</option>
            <option value="Adoração">Adoração</option>
            <option value="Outros">Outros</option>
          </select>
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
        }}>Salvar Horário</button>
      </form>
    </div>
  );
}
