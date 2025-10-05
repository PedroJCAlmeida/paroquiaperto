import React, { useState, useEffect } from 'react';
import '../styles/Backoffice.css';

function Usuario() {
  const [user, setUser] = useState({ nome: '', email: '', paroquiaPreferida: '' });
  const [paroquias, setParoquias] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);

  useEffect(() => {
    // Simula fetch do usuário logado
    setUser({ nome: 'João da Silva', email: 'joao@email.com', paroquiaPreferida: '2' });
    setForm({ nome: 'João da Silva', email: 'joao@email.com', paroquiaPreferida: '2' });
    // Busca lista de paróquias
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/paroquias`)
      .then(res => res.json())
      .then(setParoquias)
      .catch(() => setParoquias([]));
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = e => {
    e.preventDefault();
    // Aqui faria chamada ao backend para salvar dados
    setUser(form);
    setEditMode(false);
    // Feedback visual pode ser adicionado
  };

  return (
    <div className="backoffice-page">
      <h2 style={{ textAlign: 'center', color: '#2563eb', fontWeight: 900, fontSize: '2rem', marginBottom: 18 }}>Área do Usuário</h2>
      <form className="backoffice-form" style={{ maxWidth: 400, margin: '0 auto' }} onSubmit={handleSave}>
        <label>
          Nome
          <input type="text" name="nome" value={form.nome} onChange={handleChange} disabled={!editMode} />
        </label>
        <label>
          E-mail
          <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editMode} />
        </label>
        <label>
          Paróquia de preferência
          <select name="paroquiaPreferida" value={form.paroquiaPreferida} onChange={handleChange} disabled={!editMode}>
            <option value="">Selecione...</option>
            {paroquias.map(p => (
              <option key={p.id} value={p.id}>{p.nomeIgreja || p.nome}</option>
            ))}
          </select>
        </label>
        {editMode ? (
          <button type="submit">Salvar</button>
        ) : (
          <button type="button" onClick={() => setEditMode(true)}>Editar</button>
        )}
      </form>
    </div>
  );
}

export default Usuario;
