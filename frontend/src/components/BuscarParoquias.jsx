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
      background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)',
      padding: '0',
      margin: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      <div style={{
        maxWidth: 980,
        width: '100%',
        margin: '0 auto',
        paddingTop: 56,
        paddingLeft: 16,
        paddingRight: 16,
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.3rem',
          fontWeight: 900,
          color: '#2563eb',
          letterSpacing: '1.5px',
          marginBottom: 32,
          textShadow: '0 2px 16px #e0e7ff',
        }}>Buscar Paróquias</h2>
        <form style={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: '26px',
          boxShadow: '0 6px 36px rgba(60, 60, 120, 0.15)',
          padding: '44px 38px',
          display: 'flex',
          flexDirection: 'row',
          gap: '36px',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'center',
          border: '2px solid #e0e7ff',
          marginBottom: 32,
        }}>
          <label style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.18rem', minWidth: 220, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <span style={{ marginBottom: 2 }}>Buscar Paróquia</span>
            <input
              type="text"
              placeholder="Digite o nome ou horário"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: '2px solid #a5b4fc',
                marginTop: 2,
                fontSize: '1.12rem',
                background: '#f8fafc',
                transition: 'box-shadow 0.2s',
                boxShadow: '0 2px 10px rgba(60,60,120,0.09)',
                outline: 'none',
              }}
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #7c3aed'}
              onBlur={e => e.target.style.boxShadow = '0 2px 10px rgba(60,60,120,0.09)'}
            />
          </label>
          <label style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1.12rem', minWidth: 180, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <span>Distrito</span>
            <select value={distrito} onChange={e => setDistrito(e.target.value)} style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: '2px solid #a5b4fc',
              marginTop: 2,
              fontSize: '1.12rem',
              background: '#f8fafc',
              color: '#3b2f6b',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(124,58,237,0.09)',
              outline: 'none',
            }}>
              <option value="">Selecione o distrito</option>
              {distritos.map(d => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </label>
          <label style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1.12rem', minWidth: 180, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <span>Conselho</span>
            <select value={conselho} onChange={e => setConselho(e.target.value)} disabled={!distrito} style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: '2px solid #a5b4fc',
              marginTop: 2,
              fontSize: '1.12rem',
              background: !distrito ? '#f3f3f3' : '#f8fafc',
              color: '#3b2f6b',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(124,58,237,0.09)',
              outline: 'none',
            }}>
              <option value="">Selecione o conselho</option>
              {conselhos.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </label>
          <label style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1.18rem', minWidth: 180, letterSpacing: '0.5px', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Raio de busca
            </span>
            <select value={raio} onChange={e => setRaio(Number(e.target.value))} disabled={!!distrito || !!conselho} style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              border: '2px solid #fbbf24',
              marginTop: 4,
              fontSize: '1.18rem',
              background: !!distrito || !!conselho ? '#f3f3f3' : '#f8fafc',
              color: '#7c3aed',
              fontWeight: 800,
              boxShadow: '0 2px 14px rgba(251,191,36,0.10)',
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
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, alignItems: 'center', marginTop: 12 }}>
            <button type="button" style={{
              padding: '16px 32px',
              fontSize: '1.15rem',
              borderRadius: '14px',
              background: distrito || conselho ? '#cbd5e1' : 'linear-gradient(90deg,#2563eb 0%,#7c3aed 100%)',
              color: distrito || conselho ? '#334155' : '#fff',
              border: 'none',
              cursor: distrito || conselho ? 'not-allowed' : 'pointer',
              fontWeight: 800,
              boxShadow: distrito || conselho ? 'none' : '0 2px 14px rgba(99,102,241,0.15)',
              transition: 'background 0.2s',
              margin: 0,
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
                padding: '14px 24px',
                fontSize: '1.12rem',
                borderRadius: '14px',
                background: 'linear-gradient(90deg,#e11d48 0%,#fbbf24 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                boxShadow: '0 2px 14px rgba(251,191,36,0.10)',
                transition: 'background 0.2s',
                margin: 0,
              }}
              onClick={() => {
                setLat(null);
                setLng(null);
              }}>
                Limpar filtro de distância
              </button>
            )}
          </div>
          {(lat && lng) && (
            <button type="button" style={{
              padding: '12px 18px',
              fontSize: '1.12rem',
              borderRadius: '12px',
              background: 'linear-gradient(90deg,#e11d48 0%,#fbbf24 100%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginTop: '2px',
              marginBottom: '2px',
              fontWeight: 800,
              boxShadow: '0 2px 14px rgba(251,191,36,0.10)',
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

  <div style={{ marginTop: 48 }}>
          {buscaTrim && (
            <p style={{
              textAlign: 'center',
              fontSize: '1.18rem',
              color: paroquias.length > 0 ? '#2563eb' : '#e11d48',
              fontWeight: 700,
              marginBottom: 22,
              letterSpacing: '0.7px',
            }}>
              {paroquias.length > 0
                ? `Encontradas ${paroquias.length} paróquias.`
                : `Nenhuma paróquia encontrada.`}
            </p>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
          }}>
            {buscaTrim &&
              paroquias.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'linear-gradient(120deg,#fff 80%,#fde68a 100%)',
                    borderRadius: '22px',
                    boxShadow: '0 6px 32px rgba(60,60,120,0.15)',
                    padding: '28px 22px',
                    display: 'flex',
                    gap: '18px',
                    alignItems: 'flex-start',
                    minHeight: 180,
                    border: '2px solid #fbbf24',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 32px rgba(60,60,120,0.15)'}
                >
                  {p.imagem && <img src={p.imagem} alt={p.nome} style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 2px 10px rgba(99,102,241,0.12)',
                    marginRight: 16,
                  }} />}

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.35rem',
                      fontWeight: 900,
                      color: '#2563eb',
                      marginBottom: 8,
                      letterSpacing: '0.7px',
                    }}>{p.nome}</h3>
                    <p style={{ fontSize: '1.08rem', color: '#7c3aed', fontWeight: 700, marginBottom: 4 }}>
                      <strong>Endereço:</strong> {p.endereco}
                    </p>
                    <p style={{ fontSize: '1.02rem', color: '#334155', marginBottom: 8 }}>{p.descricao}</p>
                    <strong style={{ color: '#fbbf24', fontSize: '1.08rem' }}>Horários:</strong>
                    <ul style={{
                      listStyle: 'disc',
                      marginLeft: 18,
                      marginTop: 2,
                      color: '#2563eb',
                      fontSize: '1.01rem',
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
