import React, { useState, useEffect } from 'react';
import '../styles/BuscarParoquias.css';

function BuscarParoquias() {
  const [busca, setBusca] = useState('');
  const [paroquias, setParoquias] = useState([]);
  const buscaTrim = busca.trim().toLowerCase();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!buscaTrim) {
      setParoquias([]);
      return;
    }
    // Consulta ao backend
    fetch(`${apiUrl}/api/paroquias?search=${encodeURIComponent(buscaTrim)}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));
  }, [buscaTrim]);

  return (
    <div className='container'>
      <h2>Buscar Paróquias</h2>
      <form style={{
        maxWidth: 400,
        margin: '0 auto',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <label style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>
          Buscar Paróquia
          <input
            type="text"
            placeholder="Digite o nome ou horário"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
          />
        </label>
      </form>

      <div className="results-list-container">
        {buscaTrim && (
          <p className="results-message">
            {paroquias.length > 0
              ? `Encontradas ${paroquias.length} paróquias.`
              : `Nenhuma paróquia encontrada.`}
          </p>
        )}
        {buscaTrim &&
          paroquias.map((p) => (
            <div
              key={p.id}
              className="church-item"
            >
              {p.imagem && <img src={p.imagem} alt={p.nome} className="church-image" />}

              <div className="church-details">
                <h3>{p.nome}</h3>
                <p>
                  <strong>Endereço:</strong> {p.endereco}
                </p>
                <p>{p.descricao}</p>
                <strong>Horários:</strong>
                <ul className="church-hours-list">
                  {Array.isArray(p.horarios) && p.horarios.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default BuscarParoquias;
