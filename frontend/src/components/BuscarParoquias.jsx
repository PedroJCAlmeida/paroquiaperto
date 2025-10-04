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
  const [distritos, setDistritos] = useState([]);
  const [conselhos, setConselhos] = useState([]);
  const buscaTrim = busca.trim().toLowerCase();

  // Carregar distritos ao montar
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/distritos`)
      .then(res => res.json())
      .then(setDistritos)
      .catch(() => setDistritos([]));
  }, []);

  // Carregar conselhos quando distrito muda
  useEffect(() => {
    if (!distrito) {
      setConselhos([]);
      setConselho('');
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/conselhos?distritoId=${distrito}`)
      .then(res => res.json())
      .then(setConselhos)
      .catch(() => setConselhos([]));
    setConselho('');
  }, [distrito]);

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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #f3f4f8 0%, #e0e7ff 100%)',
      padding: '0',
      margin: '0',
    }}>
      <div style={{
        maxWidth: 980,
        margin: '0 auto',
        paddingTop: 48,
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#3b2f6b',
          letterSpacing: '1px',
          marginBottom: 18,
          textShadow: '0 2px 12px #e0e7ff',
        }}>Buscar Paróquias</h2>
        <form style={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: '22px',
          boxShadow: '0 4px 32px rgba(60, 60, 120, 0.13)',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid #e0e7ff',
        }}>
          <label style={{ fontWeight: 700, color: '#3b2f6b', fontSize: '1.15rem', minWidth: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ marginBottom: 2 }}>Buscar Paróquia</span>
            <input
              type="text"
              placeholder="Digite o nome ou horário"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1.5px solid #a5b4fc',
                marginTop: 2,
                fontSize: '1.08rem',
                background: '#f8fafc',
                transition: 'box-shadow 0.2s',
                boxShadow: '0 2px 8px rgba(60,60,120,0.07)',
                outline: 'none',
              }}
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #6366f1'}
              onBlur={e => e.target.style.boxShadow = '0 2px 8px rgba(60,60,120,0.07)'}
            />
          </label>
          <label style={{ fontWeight: 600, color: '#6366f1', fontSize: '1.08rem', minWidth: 180, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Distrito</span>
            <select value={distrito} onChange={e => setDistrito(e.target.value)} style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1.5px solid #a5b4fc',
              marginTop: 2,
              fontSize: '1.08rem',
              background: '#f8fafc',
              color: '#3b2f6b',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(99,102,241,0.07)',
              outline: 'none',
            }}>
              <option value="">Selecione o distrito</option>
              {distritos.map(d => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </label>
          <label style={{ fontWeight: 600, color: '#6366f1', fontSize: '1.08rem', minWidth: 180, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Conselho</span>
            <select value={conselho} onChange={e => setConselho(e.target.value)} disabled={!distrito} style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1.5px solid #a5b4fc',
              marginTop: 2,
              fontSize: '1.08rem',
              background: !distrito ? '#f3f3f3' : '#f8fafc',
              color: '#3b2f6b',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(99,102,241,0.07)',
              outline: 'none',
            }}>
              <option value="">Selecione o conselho</option>
              {conselhos.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </label>
          <label style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1.15rem', minWidth: 180, letterSpacing: '0.5px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Raio de busca
            </span>
            <select value={raio} onChange={e => setRaio(Number(e.target.value))} disabled={!!distrito || !!conselho} style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: '2px solid #7c3aed',
              marginTop: 4,
              fontSize: '1.15rem',
              background: !!distrito || !!conselho ? '#f3f3f3' : '#f8fafc',
              color: '#3b2f6b',
              fontWeight: 700,
              boxShadow: '0 2px 12px rgba(124, 58, 237, 0.10)',
              outline: 'none',
              transition: 'border 0.2s',
            }}>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </label>
          <button type="button" style={{
            padding: '12px 18px',
            fontSize: '1.08rem',
            borderRadius: '10px',
            background: distrito || conselho ? '#cbd5e1' : 'linear-gradient(90deg,#6366f1 0%,#7c3aed 100%)',
            color: distrito || conselho ? '#334155' : '#fff',
            border: 'none',
            cursor: distrito || conselho ? 'not-allowed' : 'pointer',
            marginTop: '4px',
            marginBottom: '4px',
            fontWeight: 700,
            boxShadow: distrito || conselho ? 'none' : '0 2px 12px rgba(99,102,241,0.13)',
            transition: 'background 0.2s',
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
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>
              Usar minha localização
            </span>
          </button>
          {(lat && lng) && (
            <button type="button" style={{
              padding: '10px 16px',
              fontSize: '1.05rem',
              borderRadius: '10px',
              background: 'linear-gradient(90deg,#e11d48 0%,#f43f5e 100%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginTop: '2px',
              marginBottom: '2px',
              fontWeight: 700,
              boxShadow: '0 2px 12px rgba(225,29,72,0.10)',
              transition: 'background 0.2s',
            }}
            onClick={() => {
              setLat(null);
              setLng(null);
            }}>
              Limpar filtro de distância
            </button>
          )}
        </form>

        <div style={{ marginTop: 38 }}>
          {buscaTrim && (
            <p style={{
              textAlign: 'center',
              fontSize: '1.15rem',
              color: paroquias.length > 0 ? '#6366f1' : '#e11d48',
              fontWeight: 600,
              marginBottom: 18,
              letterSpacing: '0.5px',
            }}>
              {paroquias.length > 0
                ? `Encontradas ${paroquias.length} paróquias.`
                : `Nenhuma paróquia encontrada.`}
            </p>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px',
          }}>
            {buscaTrim &&
              paroquias.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'linear-gradient(120deg,#fff 80%,#e0e7ff 100%)',
                    borderRadius: '18px',
                    boxShadow: '0 4px 24px rgba(60,60,120,0.13)',
                    padding: '24px 18px',
                    display: 'flex',
                    gap: '18px',
                    alignItems: 'flex-start',
                    minHeight: 180,
                    border: '1.5px solid #e0e7ff',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(60,60,120,0.13)'}
                >
                  {p.imagem && <img src={p.imagem} alt={p.nome} style={{
                    width: 90,
                    height: 90,
                    objectFit: 'cover',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.10)',
                    marginRight: 12,
                  }} />}

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#3b2f6b',
                      marginBottom: 6,
                      letterSpacing: '0.5px',
                    }}>{p.nome}</h3>
                    <p style={{ fontSize: '1.05rem', color: '#6366f1', fontWeight: 600, marginBottom: 2 }}>
                      <strong>Endereço:</strong> {p.endereco}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#334155', marginBottom: 6 }}>{p.descricao}</p>
                    <strong style={{ color: '#7c3aed', fontSize: '1.05rem' }}>Horários:</strong>
                    <ul style={{
                      listStyle: 'disc',
                      marginLeft: 18,
                      marginTop: 2,
                      color: '#3b2f6b',
                      fontSize: '0.98rem',
                    }}>
                      {Array.isArray(p.horarios) && p.horarios.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuscarParoquias;
