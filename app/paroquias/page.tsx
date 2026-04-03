'use client';
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParoquiaCard from '@/components/ParoquiaCard';
import '@/styles/Paroquias.css';
import type { Paroquia, Distrito, Conselho } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { 
  ssr: false,
  loading: () => <div style={{ height: '400px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando mapa...</div>
});

interface Coords {
  latitude: number;
  longitude: number;
}

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ParoquiasPage() {
  const router = useRouter();
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [lista, setLista] = useState<Paroquia[]>([]);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [distrito, setDistrito] = useState('');
  const [conselho, setConselho] = useState('');
  const [km, setKm] = useState('10');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6;

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    
    fetch('/api/distritos')
      .then((res) => res.json())
      .then((data) => setDistritos(Array.isArray(data) ? data : []))
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
      .then((data) => setConselhos(Array.isArray(data) ? data : []))
      .catch(() => setConselhos([]));
    setConselho('');
  }, [distrito]);

  useEffect(() => {
    const fetchParoquias = async (latitude?: number, longitude?: number) => {
      try {
        const res = await fetch('/api/paroquias');
        const data = await res.json();
        let paroquias = data;
        if (latitude !== undefined && longitude !== undefined) {
          paroquias = paroquias
            .map((p: any) => ({
              ...p,
              distancia: calcularDistancia(latitude, longitude, parseFloat(p.lat), parseFloat(p.lng)),
            }))
            .sort((a: any, b: any) => (a.distancia ?? 0) - (b.distancia ?? 0));
        }
        setLista(paroquias);
      } catch {
        setLista([]);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setCoords({ latitude, longitude });
          fetchParoquias(latitude, longitude);
        },
        () => fetchParoquias()
      );
    } else {
      fetchParoquias();
    }
  }, []);

  // Filtro Memoizado para performance
  const filtradas = useMemo(() => {
    setPaginaAtual(1); // Volta para pag 1 ao filtrar
    return lista.filter((p) => {
      if (distrito || conselho) {
        if (distrito && String(p.distritoId) !== String(distrito)) return false;
        if (conselho && String(p.conselhoId) !== String(conselho)) return false;
        return true;
      }
      if (km && coords && p.lat && p.lng) {
        const dist = calcularDistancia(coords.latitude, coords.longitude, parseFloat(p.lat), parseFloat(p.lng));
        return dist <= Number(km);
      }
      return true;
    });
  }, [lista, distrito, conselho, km, coords]);

  // Lógica de Paginação
  const totalPaginas = Math.ceil(filtradas.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const paroquiasExibidas = filtradas.slice(inicio, inicio + itensPorPagina);

  const handleRegistarParoquia = () => {
    const path = '/backoffice/paroquias';
    token ? router.push(path) : router.push(`/register?redirect=${path}`);
  };

return (
    <>
      <Navbar />
      <div className="paroquias-page-container">
        <div className="paroquias-page">
          <div className="page-header-section">
            <h2 className="paroquias-title">Paróquias Próximas</h2>
            <button onClick={handleRegistarParoquia} className="btn-registar-gradiente">
              <Plus size={18} /> Registar Paróquia
            </button>
          </div>

          <div className="paroquias-filters-container">
            <select value={distrito} onChange={(e) => setDistrito(e.target.value)} className="paroquias-select">
              <option value="">Distrito (Todos)</option>
              {distritos.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>

            <select value={conselho} onChange={(e) => setConselho(e.target.value)} disabled={!distrito} className="paroquias-select">
              <option value="">Conselho (Todos)</option>
              {conselhos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>

            <select value={km} onChange={(e) => setKm(e.target.value)} disabled={!!distrito} className="paroquias-select">
              <option value="">Raio (km)</option>
              {[5, 10, 20, 50, 100].map(v => <option key={v} value={v}>{v} km</option>)}
            </select>
          </div>

          <div className="paroquias-mapa-wrapper">
            <Mapa paroquias={filtradas} coords={coords} />
          </div>

          {loading ? (
            <div className="loading-state-centered"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="results-wrapper">
              <div className="paroquias-grid-3col">
                {paroquiasExibidas.map((p) => (
                  <ParoquiaCard
                    key={p.id}
                    dados={{
                      ...p,
                      distancia: p.distancia !== undefined ? p.distancia.toFixed(1) : '-',
                    }}
                  />
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="pagination-wrapper">
                  <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(p => p - 1)} className="btn-paginacao">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="pagination-text">{paginaAtual} de {totalPaginas}</span>
                  <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(p => p + 1)} className="btn-paginacao">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}