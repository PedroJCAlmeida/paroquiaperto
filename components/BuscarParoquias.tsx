'use client';
import React, { useState, useEffect } from 'react';
import '@/styles/BuscarParoquias.css';
import type { Paroquia, Distrito, Conselho } from '@/types';
import router from 'next/router';

interface BuscarParoquiasProps {
  embedded?: boolean;
}

function BuscarParoquias({ embedded = false }: BuscarParoquiasProps) {
  const [busca, setBusca] = useState('');
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [raio, setRaio] = useState(10);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [distrito, setDistrito] = useState('');
  const [conselho, setConselho] = useState('');
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const buscaTrim = busca.trim().toLowerCase();

  useEffect(() => {
    const savedLat = localStorage.getItem('lat');
    const savedLng = localStorage.getItem('lng');

    if (savedLat && savedLng) {
      setLat(Number(savedLat));
      setLng(Number(savedLng));
      // Opcional: Limpar o localStorage após ler para não "forçar" 
      // sempre a mesma localização se o utilizador quiser mudar
      // localStorage.removeItem('lat');
      // localStorage.removeItem('lng');
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/distritos')
      .then((res) => res.json())
      .then((data: Distrito[]) => setDistritos(Array.isArray(data) ? data : []))
      .catch(() => setDistritos([]));
  }, []);

  useEffect(() => {
    if (!distrito) {
      setConselhos([]);
      setConselho('');
      return;
    }
    fetch(`/api/conselhos?distritoId=${distrito}`)
      .then((res) => res.json())
      .then((data: Conselho[]) => setConselhos(Array.isArray(data) ? data : []))
      .catch(() => setConselhos([]));
    setConselho('');
  }, [distrito]);

  useEffect(() => {
    // Se não houver texto, nem localização, nem distrito, não fazemos nada
    if (!buscaTrim && !lat && !distrito) {
      // Opcional: Carregar "Destaques" ou deixar vazio
      return;
    }

    let url = `/api/paroquias?`;

    // Adiciona parâmetros conforme existam
    const params = new URLSearchParams();
    if (buscaTrim) params.append('search', buscaTrim);
    if (distrito) params.append('distrito', distrito);
    if (conselho) params.append('conselho', conselho);
    if (lat && lng && !distrito) {
      params.append('lat', lat.toString());
      params.append('lng', lng.toString());
      params.append('raio', raio.toString());
    }

    fetch(`${url}${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));
  }, [buscaTrim, raio, lat, lng, distrito, conselho]);

  return (
    <div
      style={{
        minHeight: embedded ? undefined : '100vh',
        background: embedded ? 'transparent' : 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: 980, width: '100%', margin: '0 auto', paddingTop: 56, paddingLeft: 16, paddingRight: 16 }}>
        {!embedded && (
          <h2 style={{ textAlign: 'center', fontSize: '2.3rem', fontWeight: 900, color: '#243B55', letterSpacing: '1.5px', marginBottom: 32, textShadow: '0 2px 16px #e0e7ff' }}>
            Buscar Paróquias
          </h2>
        )}
        <form
          style={{
            background: 'rgba(255,255,255,0.98)',
            borderRadius: '26px',
            boxShadow: '0 6px 36px rgba(60,60,120,0.15)',
            padding: isMobile ? '24px 8px' : embedded ? '28px 24px' : '44px 38px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '18px' : '36px',
            flexWrap: 'wrap',
            alignItems: isMobile ? 'center' : 'flex-end',
            justifyContent: 'center',
            border: '2px solid #e0e7ff',
            marginBottom: 32,
            width: '100%',
            maxWidth: isMobile ? 400 : embedded ? 840 : 760,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <label style={{ fontWeight: 800, color: '#243B55', fontSize: isMobile ? '1.08rem' : '1.18rem', minWidth: isMobile ? 120 : 220, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <span style={{ marginBottom: 2 }}>Buscar Paróquia</span>
            <input
              type="text"
              placeholder="Digite o nome ou horário"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ width: '100%', padding: isMobile ? '10px' : '14px', borderRadius: '14px', border: '2px solid #a5b4fc', marginTop: 2, fontSize: isMobile ? '1rem' : '1.12rem', background: '#f8fafc', outline: 'none' }}
            />
          </label>
          <label style={{ fontWeight: 700, color: '#243B55', fontSize: isMobile ? '1rem' : '1.12rem', minWidth: isMobile ? 120 : 180, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <span>Distrito</span>
            <select value={distrito} onChange={(e) => setDistrito(e.target.value)} style={{ width: '100%', padding: isMobile ? '10px' : '14px', borderRadius: '14px', border: '2px solid #a5b4fc', marginTop: 2, fontSize: isMobile ? '1rem' : '1.12rem', background: '#f8fafc' }}>
              <option value="">Selecione o distrito</option>
              {distritos.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 700, color: '#243B55', fontSize: isMobile ? '1rem' : '1.12rem', minWidth: isMobile ? 120 : 180, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <span>Conselho</span>
            <select value={conselho} onChange={(e) => setConselho(e.target.value)} disabled={!distrito} style={{ width: '100%', padding: isMobile ? '10px' : '14px', borderRadius: '14px', border: '2px solid #a5b4fc', marginTop: 2, fontSize: isMobile ? '1rem' : '1.12rem', background: !distrito ? '#f3f3f3' : '#f8fafc' }}>
              <option value="">Selecione o conselho</option>
              {conselhos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 800, color: '#A67C52', fontSize: isMobile ? '1rem' : '1.18rem', minWidth: isMobile ? 120 : 180, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <span>Raio de busca</span>
            <select value={raio} onChange={(e) => setRaio(Number(e.target.value))} disabled={!!distrito || !!conselho} style={{ width: '100%', padding: isMobile ? '12px' : '16px', borderRadius: '16px', border: '2px solid #A67C52', marginTop: 4, fontSize: isMobile ? '1rem' : '1.18rem', background: distrito || conselho ? '#f3f3f3' : '#f8fafc', color: '#243B55', fontWeight: 800 }}>
              {[5, 10, 20, 50, 100].map((v) => <option key={v} value={v}>{v} km</option>)}
            </select>
          </label>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, alignItems: 'center', marginTop: 12 }}>
            <button
              type="button"
              disabled={!!distrito || !!conselho}
              style={{ padding: '16px 32px', fontSize: '1.15rem', borderRadius: '14px', background: distrito || conselho ? '#cbd5e1' : 'linear-gradient(135deg,#243B55 0%,#3E5C76 100%)', color: distrito || conselho ? '#334155' : '#fff', border: 'none', cursor: distrito || conselho ? 'not-allowed' : 'pointer', fontWeight: 800 }}
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); },
                    () => alert('Não foi possível obter sua localização.'),
                  );
                } else {
                  alert('Geolocalização não suportada.');
                }
              }}
            >
              Usar minha localização
            </button>
            {lat && lng && (
              <button
                type="button"
                style={{ padding: '14px 24px', fontSize: '1.12rem', borderRadius: '14px', background: 'linear-gradient(90deg,#e11d48 0%,#A67C52 100%)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800 }}
                onClick={() => { setLat(null); setLng(null); }}
              >
                Limpar filtro
              </button>
            )}
          </div>
        </form>

        <div style={{ marginTop: 48 }}>
          {buscaTrim && (
            <p style={{ textAlign: 'center', fontSize: '1.18rem', color: paroquias.length > 0 ? '#243B55' : '#e11d48', fontWeight: 700, marginBottom: 22 }}>
              {paroquias.length > 0 ? `Encontradas ${paroquias.length} paróquias.` : 'Nenhuma paróquia encontrada.'}
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))', gap: isMobile ? '18px' : '32px' }}>
            {buscaTrim &&
              paroquias.map((p) => (
                <div key={p.id} style={{ background: 'linear-gradient(120deg,#fff 80%,#fde68a 100%)', borderRadius: '22px', boxShadow: '0 6px 32px rgba(60,60,120,0.15)', padding: '28px 22px', display: 'flex', gap: '18px', alignItems: 'flex-start', minHeight: 180, border: '2px solid #A67C52' }}>
                  {p.imagem && <img src={p.imagem} alt={p.nome} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '16px', marginRight: 16 }} />}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 900,
                        color: '#243B55',
                        marginBottom: 8,
                        cursor: 'pointer', // Indica que é clicável
                        textDecoration: 'underline transparent' // Estética
                      }}
                      onClick={() => router.push(`/paroquias/${p.id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#3E5C76'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#243B55'}
                    >
                      {p.nome}
                    </h3>
                    <p style={{ fontSize: '1.08rem', color: '#243B55', fontWeight: 700, marginBottom: 4 }}>
                      <strong>Endereço:</strong> {p.endereco}
                    </p>
                    <p style={{ fontSize: '1.02rem', color: '#334155', marginBottom: 8 }}>{p.descricao}</p>
                    <strong style={{ color: '#A67C52', fontSize: '1.08rem' }}>Horários:</strong>
                    <ul style={{ listStyle: 'disc', marginLeft: 18, marginTop: 2, color: '#243B55', fontSize: '1.01rem' }}>
                      {Array.isArray(p.horarios) &&
                        p.horarios.map((h, idx) => (
                          <li key={idx}>
                            {typeof h === 'object' ? `${h.diaSemana} ${h.hora} - ${h.tipo}` : String(h)}
                          </li>
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

