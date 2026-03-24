'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ParoquiaCard from '@/components/ParoquiaCard';
import '@/styles/Paroquias.css';

const Mapa = dynamic(() => import('@/components/Mapa'), { ssr: false });

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Paroquias = () => {
  const [distritos, setDistritos] = useState([]);
  const [conselhos, setConselhos] = useState([]);
  const [lista, setLista] = useState([]);
  const [coords, setCoords] = useState(null);
  const [distrito, setDistrito] = useState('');
  const [conselho, setConselho] = useState('');
  const [km, setKm] = useState('10');

  useEffect(() => {
    fetch('/api/distritos')
      .then(res => res.json())
      .then(data => setDistritos(Array.isArray(data) ? data : []))
      .catch(() => setDistritos([]));
  }, []);

  useEffect(() => {
    if (!distrito) {
      setConselhos([]);
      setConselho('');
      return;
    }
    fetch(`/api/conselhos?distritoId=${distrito}`)
      .then(res => res.json())
      .then(data => setConselhos(Array.isArray(data) ? data : []))
      .catch(() => setConselhos([]));
    setConselho('');
  }, [distrito]);

  useEffect(() => {
    const fetchParoquias = async (latitude, longitude) => {
      try {
        const res = await fetch('/api/paroquias');
        const data = await res.json();
        let paroquias = data;
        if (latitude && longitude) {
          paroquias = paroquias.map(p => ({
            ...p,
            distancia: calcularDistancia(latitude, longitude, parseFloat(p.lat), parseFloat(p.lng))
          })).sort((a, b) => a.distancia - b.distancia);
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
      () => fetchParoquias()
    );
  }, []);

  const listaFiltrada = () => {
    return lista.filter(p => {
      if (distrito || conselho) {
        if (distrito && (!p.distrito || String(p.distrito.id) !== String(distrito))) return false;
        if (conselho && (!p.conselho || String(p.conselho.id) !== String(conselho))) return false;
        return true;
      }
      if (km && coords && p.lat && p.lng) {
        const dist = calcularDistancia(coords.latitude, coords.longitude, parseFloat(p.lat), parseFloat(p.lng));
        if (dist > Number(km)) return false;
      }
      return true;
    });
  };

  return (
    <div className="paroquias-page">
      <Navbar />
      <h2 className="paroquias-title">Paróquias Próximas</h2>
      <div className="paroquias-filters">
        <select value={distrito} onChange={e => { setDistrito(e.target.value); if (e.target.value) { setKm(''); setConselho(''); } }} className="paroquias-select paroquias-select--distrito">
          <option value="">Distrito</option>
          {distritos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
        <select value={conselho} onChange={e => { setConselho(e.target.value); if (e.target.value) setKm(''); }} className={`paroquias-select paroquias-select--conselho${!distrito ? ' paroquias-select--disabled' : ''}`} disabled={!distrito}>
          <option value="">Conselho</option>
          {conselhos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select value={km} onChange={e => { setKm(e.target.value); if (e.target.value) { setDistrito(''); setConselho(''); } }} className={`paroquias-select paroquias-select--km${(distrito || conselho) ? ' paroquias-select--disabled' : ''}`} disabled={!!distrito || !!conselho}>
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
        {listaFiltrada().map(p => (
          <ParoquiaCard key={p.id} dados={{ id: p.id, distancia: p.distancia ? p.distancia.toFixed(1) : '-', nome: p.nome, endereco: p.endereco, descricao: p.descricao, horarios: p.horarios, contato: p.contato, email: p.email, site: p.site, imagem: p.imagem, instagram: p.instagram, facebook: p.facebook, whatsapp: p.whatsapp }} />
        ))}
      </div>
    </div>
  );
};

export default Paroquias;
