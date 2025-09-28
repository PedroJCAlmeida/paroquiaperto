import React, { useEffect, useState } from 'react';
import ParoquiaCard from '../components/ParoquiaCard';
import Mapa from '../components/Mapa';
import '../styles/Paroquias.css';

// Função Haversine para calcular distância em km
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // raio da Terra em km
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
  const [km, setKm] = useState('');

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

  // Carregar lista de paróquias e calcular distância
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const fetchParoquias = async (latitude, longitude) => {
      try {
        const res = await fetch(`${apiUrl}/api/paroquias`);
        const data = await res.json();
        let paroquias = data;
        if (latitude && longitude) {
          paroquias = paroquias.map(p => ({
            ...p,
            distancia: calcularDistancia(latitude, longitude, p.lat, p.lng)
          })).sort((a, b) => a.distancia - b.distancia);
        }
        setLista(paroquias);
      } catch (err) {
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
      () => {
        fetchParoquias();
      }
    );
  }, []);

  // Função para filtrar lista conforme campos
  const listaFiltrada = () => {
    return lista.filter(p => {
      // Filtro por distrito
      if (distrito && (!p.distrito || String(p.distrito.id) !== String(distrito))) return false;
      // Filtro por conselho
      if (conselho && (!p.conselho || String(p.conselho.id) !== String(conselho))) return false;
      // Filtro por km
      if (km && coords && p.lat && p.lng) {
        const dist = calcularDistancia(coords.latitude, coords.longitude, p.lat, p.lng);
        if (dist > Number(km)) return false;
      }
      return true;
    });
  };

  return (
    <div className="paroquias-page">
      <h2 className="paroquias-title">Paróquias Próximas</h2>
      {/* Filtros */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select
          value={distrito}
          onChange={e => setDistrito(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', minWidth: '120px' }}
        >
          <option value="">Distrito</option>
          {distritos.map(d => (
            <option key={d.id} value={d.id}>{d.nome}</option>
          ))}
        </select>
        <select
          value={conselho}
          onChange={e => setConselho(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', minWidth: '120px' }}
          disabled={!distrito}
        >
          <option value="">Conselho</option>
          {conselhos.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Raio (km)"
          value={km}
          onChange={e => setKm(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', minWidth: '120px' }}
        />
      </div>
      {/* Mapa com Leaflet */}
      <div className="paroquias-mapa">
        <Mapa paroquias={listaFiltrada()} coords={coords} />
      </div>
      {/* Lista de cartões filtrada */}
      <div className="paroquias-lista">
        {listaFiltrada().map(p => (
          <ParoquiaCard
            key={p.id}
            dados={{
              id: p.id,
              distancia: p.distancia ? p.distancia.toFixed(1) : '-',
              nomeIgreja: p.nomeIgreja ? p.nomeIgreja : 'UNDEFINED',
              nome: p.nome,
              endereco: p.endereco,
              descricao: p.descricao,
              horarios: p.horarios,
              contato: p.contato,
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
  );
};

export default Paroquias;