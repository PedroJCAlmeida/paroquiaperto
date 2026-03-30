'use client';
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParoquiaCard from '@/components/ParoquiaCard';
import '@/styles/Paroquias.css';
import type { Paroquia, Distrito, Conselho } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { ssr: false });

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

// O componente da PÁGINA não deve receber props como 'dados'
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

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    
    fetch('/api/distritos')
      .then((res) => res.json())
      .then((data) => setDistritos(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (!distrito) {
      setConselhos([]);
      setConselho('');
      return;
    }
    fetch(`/api/conselhos?distritoId=${distrito}`)
      .then((res) => res.json())
      .then((data) => setConselhos(Array.isArray(data) ? data : []));
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

  const listaFiltrada = useMemo(() => {
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

  return (
    <>
      <Navbar />
      <div className="paroquias-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
          <h2 className="paroquias-title">Paróquias Próximas</h2>
          <button 
            onClick={() => router.push(token ? '/backoffice/paroquias' : '/register')}
            className="bo-btn bo-btn-primary"
          >
            <Plus size={18} /> Registar Paróquia
          </button>
        </div>

        <div className="paroquias-filters">
          <select value={distrito} onChange={(e) => setDistrito(e.target.value)} className="paroquias-select">
            <option value="">Distrito</option>
            {distritos.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
          {/* ... outros selects de filtro ... */}
        </div>

        <div className="paroquias-mapa">
          <Mapa paroquias={listaFiltrada} coords={coords} />
        </div>

        <div className="paroquias-lista">
          {listaFiltrada.map((p) => (
            <ParoquiaCard
              key={p.id}
              dados={{
                ...p,
                distancia: p.distancia !== undefined ? p.distancia.toFixed(1) : '-',
              }}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}