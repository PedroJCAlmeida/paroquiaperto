'use client';
import React, { useState, useEffect } from 'react';
import '@/styles/BuscarParoquias.css';
import type { Paroquia, Distrito, Conselho } from '@/types';
import { ChevronLeft, ChevronRight, Search, LocateFixed } from 'lucide-react';
import ParoquiaCard from '@/components/ParoquiaCard';

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
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);

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
    <div className="paroquias-page-container">
      <div className="paroquias-page">
        <div className="page-header-section">
          <h2 className="paroquias-title">Buscar Paróquias</h2>
        </div>
        <div className="paroquias-filters-container">
          <input
            type="text"
            className="paroquias-select"
            placeholder="Ex: Cedofeita ou 11:00"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ minWidth: 200 }}
          />
          <select value={distrito} onChange={(e) => setDistrito(e.target.value)} className="paroquias-select">
            <option value="">Distrito (Todos)</option>
            {distritos.map((d) => <option key={d.id} value={String(d.id)}>{d.nome}</option>)}
          </select>
          <select value={conselho} onChange={(e) => setConselho(e.target.value)} disabled={!distrito} className="paroquias-select">
            <option value="">Conselho (Todos)</option>
            {conselhos.map((c) => <option key={c.id} value={String(c.id)}>{c.nome}</option>)}
          </select>
          <select value={raio} onChange={(e) => setRaio(Number(e.target.value))} disabled={!!distrito} className="paroquias-select">
            {[5, 10, 20, 50, 100].map((v) => <option key={v} value={v}>{v} km</option>)}
          </select>
          <button
            type="button"
            className="btn-registar-gradiente"
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
            style={{ minWidth: 160 }}
          >
            <LocateFixed size={18} className={loadingGPS ? 'animate-spin' : ''} />
            {loadingGPS ? 'A localizar...' : 'Perto de mim'}
          </button>
        </div>
        <div style={{ marginTop: 20 }}>
          {hasSearched && (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#243B55', fontWeight: 700, marginBottom: 30 }}>
              {paroquias.length > 0 ? `Encontrámos ${paroquias.length} paróquias.` : 'Nenhuma paróquia encontrada.'}
            </p>
          )}
          <div className="paroquias-grid-3col">
            {paroquiasExibidas.map((p) => (
              <ParoquiaCard
                key={p.id}
                dados={{
                  ...p,
                  distancia: p.distancia?.toString() || '-'
                }}
              />
            ))}
          </div>
          {totalPaginas > 1 && (
            <div className="pagination-wrapper">
              <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(prev => prev - 1)} className="btn-paginacao">
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPaginas)].map((_, i) => (
                <button key={i} onClick={() => setPaginaAtual(i + 1)} className="btn-paginacao" style={{ background: paginaAtual === i + 1 ? '#243B55' : '#fff', color: paginaAtual === i + 1 ? '#fff' : '#243B55' }}>
                  {i + 1}
                </button>
              ))}
              <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(prev => prev + 1)} className="btn-paginacao">
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
