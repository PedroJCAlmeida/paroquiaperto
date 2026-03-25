'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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

const Paroquias = () => {
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
    const t = localStorage.getItem('token');
    setToken(t);
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
    const fetchParoquias = async (latitude?: number, longitude?: number) => {
      try {
        const res = await fetch('/api/paroquias');
        const data = (await res.json()) as Paroquia[];
        let paroquias = data;
        if (latitude !== undefined && longitude !== undefined) {
          paroquias = paroquias
            .map((p) => ({
              ...p,
              distancia: calcularDistancia(latitude, longitude, parseFloat(p.lat), parseFloat(p.lng)),
            }))
            .sort((a, b) => (a.distancia ?? 0) - (b.distancia ?? 0));
        }
        setLista(paroquias);
      } catch {
        setLista([]);
      }
    };

    if (!navigator.geolocation) {
      fetchParoquias();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ latitude, longitude });
        fetchParoquias(latitude, longitude);
      },
      () => fetchParoquias(),
    );
  }, []);

  const listaFiltrada = (): Paroquia[] => {
    return lista.filter((p) => {
      if (distrito || conselho) {
        if (distrito && (!p.distrito || String(p.distrito.id) !== String(distrito))) return false;
        if (conselho && (!p.conselho || String(p.conselho.id) !== String(conselho))) return false;
        return true;
      }
      if (km && coords && p.lat && p.lng) {
        const dist = calcularDistancia(
          coords.latitude,
          coords.longitude,
          parseFloat(p.lat),
          parseFloat(p.lng),
        );
        if (dist > Number(km)) return false;
      }
      return true;
    });
  };

  const handleRegistarParoquia = () => {
    if (!token) {
      router.push('/register?redirect=/backoffice/paroquias&message=Registe-se para registar uma paroquia');
    } else {
      router.push('/backoffice/paroquias');
    }
  };

  return (
    <>
      <div className="paroquias-page">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 className="paroquias-title" style={{ margin: 0 }}>Paróquias Próximas</h2>
          <button 
            onClick={handleRegistarParoquia}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #243B55 0%, #3E5C76 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 2px 8px rgba(30, 64, 175, 0.2)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 64, 175, 0.2)';
            }}
          >
            <Plus size={18} />
            Registar Paróquia
          </button>
        </div>
      <div className="paroquias-filters">
        <select
          value={distrito}
          onChange={(e) => {
            setDistrito(e.target.value);
            if (e.target.value) {
              setKm('');
              setConselho('');
            }
          }}
          className="paroquias-select paroquias-select--distrito"
        >
          <option value="">Distrito</option>
          {distritos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </select>
        <select
          value={conselho}
          onChange={(e) => {
            setConselho(e.target.value);
            if (e.target.value) setKm('');
          }}
          className={`paroquias-select paroquias-select--conselho${!distrito ? ' paroquias-select--disabled' : ''}`}
          disabled={!distrito}
        >
          <option value="">Conselho</option>
          {conselhos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <select
          value={km}
          onChange={(e) => {
            setKm(e.target.value);
            if (e.target.value) {
              setDistrito('');
              setConselho('');
            }
          }}
          className={`paroquias-select paroquias-select--km${distrito || conselho ? ' paroquias-select--disabled' : ''}`}
          disabled={!!distrito || !!conselho}
        >
          <option value="">Raio (km)</option>
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={20}>20 km</option>
          <option value={50}>50 km</option>
          <option value={100}>100 km</option>
        </select>
      </div>
      <div className="paroquias-mapa">
        <Mapa paroquias={listaFiltrada()} coords={coords} />
      </div>
      <div className="paroquias-lista">
        {listaFiltrada().map((p) => (
          <ParoquiaCard
            key={p.id}
            dados={{
              id: p.id,
              distancia: p.distancia !== undefined ? p.distancia.toFixed(1) : '-',
              nome: p.nome,
              endereco: p.endereco,
              descricao: p.descricao,
              horarios: p.horarios,
              email: p.email,
              site: p.site,
              imagem: p.imagem,
              instagram: p.instagram,
              facebook: p.facebook,
              whatsapp: p.whatsapp,
            }}
          />
        ))}
      </div>
    </div>
    <Footer />
  </>
  );
};

export default Paroquias;

