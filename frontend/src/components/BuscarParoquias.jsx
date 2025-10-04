import React, { useState, useEffect } from 'react';
import '../styles/BuscarParoquias.css';

function BuscarParoquias() {
  const [busca, setBusca] = useState('');
  const [paroquias, setParoquias] = useState([]);
  const [raio, setRaio] = useState(10); // valor padrão 10km
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [distrito, setDistrito] = useState('');
  const [conselho, setConselho] = useState('');
  const buscaTrim = busca.trim().toLowerCase();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!buscaTrim) {
      setParoquias([]);
      return;
    }
    let url = `${apiUrl}/api/paroquias?search=${encodeURIComponent(buscaTrim)}`;
    // Se distrito ou conselho estiverem preenchidos, ignora filtro de distância
    if (distrito || conselho) {
      if (distrito) url += `&distrito=${encodeURIComponent(distrito)}`;
      if (conselho) url += `&conselho=${encodeURIComponent(conselho)}`;
    } else {
      url += `&raio=${raio}`;
      if (lat && lng) {
        url += `&lat=${lat}&lng=${lng}`;
      }
    }
    fetch(url)
      .then(res => res.ok ? res.json() : [])
      .then(data => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));
  }, [buscaTrim, raio, lat, lng, distrito, conselho]);

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
        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Distrito
          <input
            type="text"
            placeholder="Digite o distrito"
            value={distrito}
            onChange={e => setDistrito(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
          />
        </label>
        <label style={{ fontWeight: 500, color: '#334155', fontSize: '1rem', marginBottom: 6 }}>
          Conselho
          <input
            type="text"
            placeholder="Digite o conselho"
            value={conselho}
            onChange={e => setConselho(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: 4, fontSize: '1rem' }}
          />
        </label>
        <label style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1.08rem', marginBottom: 6, letterSpacing: '0.5px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Raio de busca
          </span>
          <select value={raio} onChange={e => setRaio(Number(e.target.value))} disabled={!!distrito || !!conselho} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #7c3aed', marginTop: 8, fontSize: '1.08rem', background: !!distrito || !!conselho ? '#f3f3f3' : '#f8fafc', color: '#3b2f6b', fontWeight: 600, boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)' }}>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
        </label>
        <button type="button" style={{
          padding: '8px 10px',
          fontSize: '0.95rem',
          borderRadius: '6px',
          background: distrito || conselho ? '#cbd5e1' : '#2563eb',
          color: distrito || conselho ? '#334155' : '#fff',
          border: 'none',
          cursor: distrito || conselho ? 'not-allowed' : 'pointer',
          marginTop: '4px',
          marginBottom: '4px',
          boxShadow: '0 1px 4px rgba(37,99,235,0.08)'
        }}
        disabled={!!distrito || !!conselho}
        onClick={() => {
          if (distrito || conselho) return;
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              pos => {
                setLat(pos.coords.latitude);
                setLng(pos.coords.longitude);
              },
              err => {
                alert('Não foi possível obter sua localização.');
              }
            );
          } else {
            alert('Geolocalização não suportada.');
          }
        }}>
          Usar minha localização
        </button>
        {(lat && lng) && (
          <button type="button" style={{
            padding: '6px 10px',
            fontSize: '0.92rem',
            borderRadius: '6px',
            background: '#e11d48',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginTop: '2px',
            marginBottom: '2px',
            boxShadow: '0 1px 4px rgba(225,29,72,0.08)'
          }}
          onClick={() => {
            setLat(null);
            setLng(null);
          }}>
            Limpar filtro de distância
          </button>
        )}
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
