'use client';
import React, { useState, useEffect } from 'react';
import '@/styles/BuscarParoquias.css';
import type { Paroquia, Distrito, Conselho } from '@/types';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search, MapPin, Navigation } from 'lucide-react';
import { LocateFixed } from 'lucide-react';

interface BuscarParoquiasProps {
  embedded?: boolean;
}

function BuscarParoquias({ embedded = false }: BuscarParoquiasProps) {
  const router = useRouter();
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
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);

  // --- Paginação ---
  const [paginaAtual, setPaginaAtual] = useState(1);
  const paroquiasPorPagina = 6; 

  const buscaTrim = busca.trim().toLowerCase();

  useEffect(() => {
    setPaginaAtual(1);
  }, [buscaTrim, raio, lat, lng, distrito, conselho]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
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
    if (!buscaTrim && !lat && !distrito) {
      setParoquias([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const params = new URLSearchParams();
    if (buscaTrim) params.append('search', buscaTrim);
    if (distrito) params.append('distrito', distrito);
    if (conselho) params.append('conselho', conselho);
    if (lat && lng && !distrito) {
      params.append('lat', lat.toString());
      params.append('lng', lng.toString());
      params.append('raio', raio.toString());
    }

    fetch(`/api/paroquias?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));
  }, [buscaTrim, raio, lat, lng, distrito, conselho]);

  const indiceUltima = paginaAtual * paroquiasPorPagina;
  const indicePrimeira = indiceUltima - paroquiasPorPagina;
  const paroquiasExibidas = paroquias.slice(indicePrimeira, indiceUltima);
  const totalPaginas = Math.ceil(paroquias.length / paroquiasPorPagina);

  return (
    <div style={{
      minHeight: embedded ? undefined : '100vh',
      background: embedded ? 'transparent' : 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)',
      paddingBottom: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowX: 'hidden',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', paddingTop: 56, paddingLeft: 16, paddingRight: 16 }}>
        {!embedded && (
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#243B55', marginBottom: 40 }}>
            Buscar Paróquias
          </h2>
        )}

        {/* --- FORMULÁRIO DE FILTROS --- */}
        <form style={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: '26px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          padding: isMobile ? '24px' : '40px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '20px',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'center',
          border: '1px solid #e2e8f0',
          marginBottom: 48,
        }}>
          <label style={{ flex: 1, minWidth: isMobile ? '100%' : '250px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 700, color: '#243B55' }}>Nome ou Horário</span>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Ex: Cedofeita ou 11:00"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
              />
            </div>
          </label>

          <label style={{ flex: 1, minWidth: isMobile ? '100%' : '180px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 700, color: '#243B55' }}>Distrito</span>
            <select value={distrito} onChange={(e) => setDistrito(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: '#fff' }}>
              <option value="">Todos</option>
              {distritos.map((d) => <option key={d.id} value={String(d.id)}>{d.nome}</option>)}
            </select>
          </label>

          <label style={{ flex: 1, minWidth: isMobile ? '100%' : '180px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 700, color: '#243B55' }}>Conselho</span>
            <select value={conselho} onChange={(e) => setConselho(e.target.value)} disabled={!distrito} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', background: !distrito ? '#f1f5f9' : '#fff' }}>
              <option value="">Todos</option>
              {conselhos.map((c) => <option key={c.id} value={String(c.id)}>{c.nome}</option>)}
            </select>
          </label>

          <label style={{ width: isMobile ? '100%' : '120px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 700, color: '#A67C52' }}>Raio</span>
            <select value={raio} onChange={(e) => setRaio(Number(e.target.value))} disabled={!!distrito} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #A67C52', fontSize: '1rem', fontWeight: 'bold' }}>
              {[5, 10, 20, 50, 100].map((v) => <option key={v} value={v}>{v} km</option>)}
            </select>
          </label>

          <button
  type="button"
  disabled={loadingGPS}
  onClick={() => {
    if (navigator.geolocation) {
      setLoadingGPS(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude); 
          setLng(pos.coords.longitude);
          setLoadingGPS(false);
        },
        () => {
          alert('Não foi possível obter a sua localização.');
          setLoadingGPS(false);
        }
      );
    }
  }}
  style={{ 
    padding: '14px 24px', 
    background: 'linear-gradient(135deg,#243B55,#3E5C76)', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: 800, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 8,
    whiteSpace: 'nowrap',
    opacity: loadingGPS ? 0.7 : 1,
    cursor: loadingGPS ? 'wait' : 'pointer', // AGORA SÓ EXISTE ESTA LINHA DE CURSOR
    transition: 'all 0.3s ease'
  }}
>
  <LocateFixed size={18} className={loadingGPS ? 'animate-spin' : ''} />
  {loadingGPS ? 'A localizar...' : 'Perto de mim'}
</button>
        </form>

        {/* --- LISTAGEM --- */}
        <div style={{ marginTop: 20 }}>
          {hasSearched && (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#243B55', fontWeight: 700, marginBottom: 30 }}>
              {paroquias.length > 0 ? `Encontrámos ${paroquias.length} paróquias.` : 'Nenhuma paróquia encontrada.'}
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '30px' }}>
            {paroquiasExibidas.map((p) => (
              <div key={p.id} style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '180px' }}>
                  <img src={p.imagem || "/logo_paroquia.png"} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {p.distancia && <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, color: '#A67C52' }}>{p.distancia}km</span>}
                </div>
                
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 onClick={() => router.push(`/paroquias/${p.id}`)} style={{ fontSize: '1.3rem', fontWeight: 900, color: '#243B55', marginBottom: 10, cursor: 'pointer' }}>{p.nome}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 15 }}>
                    <MapPin size={14} style={{ marginTop: 3, flexShrink: 0 }} /> {p.endereco}
                  </p>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#A67C52', textTransform: 'uppercase', letterSpacing: 1 }}>Horários:</strong>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0', fontSize: '0.9rem' }}>
                      {p.horarios?.slice(0, 2).map((h: any, i: number) => (
                        <li key={i} style={{ marginBottom: 4, color: '#334155' }}>• {h.diaSemana} - {h.hora}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- PAGINAÇÃO --- */}
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 60 }}>
              <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(prev => prev - 1)} style={{ padding: '10px', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPaginas)].map((_, i) => (
                <button key={i} onClick={() => setPaginaAtual(i + 1)} style={{ width: 40, height: 40, borderRadius: '12px', border: 'none', background: paginaAtual === i + 1 ? '#243B55' : '#fff', color: paginaAtual === i + 1 ? '#fff' : '#243B55', fontWeight: 700, cursor: 'pointer' }}>
                  {i + 1}
                </button>
              ))}
              <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(prev => prev + 1)} style={{ padding: '10px', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuscarParoquias;
