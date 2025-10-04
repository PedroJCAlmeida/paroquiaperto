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
  const [km, setKm] = useState('10'); // valor padrão igual ao BuscarParoquias

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
      // Se distrito ou conselho estiverem preenchidos, ignora filtro de raio
      if (distrito || conselho) {
        if (distrito && (!p.distrito || String(p.distrito.id) !== String(distrito))) return false;
        if (conselho && (!p.conselho || String(p.conselho.id) !== String(conselho))) return false;
        return true;
      }
      // Se raio estiver preenchido, ignora distrito/conselho
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
      <div style={{ display: 'flex', gap: '18px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <select
          value={distrito}
          onChange={e => {
            setDistrito(e.target.value);
            if (e.target.value) {
              setKm(''); // Limpa raio se distrito selecionado
              setConselho(''); // Limpa conselho se distrito selecionado
            }
          }}
          style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #a5b4fc', minWidth: '140px', fontSize: '1.08rem', background: '#f8fafc', color: '#2563eb', fontWeight: 600 }}
        >
          <option value="">Distrito</option>
          {distritos.map(d => (
            <option key={d.id} value={d.id}>{d.nome}</option>
          ))}
        </select>
        <select
          value={conselho}
          onChange={e => {
            setConselho(e.target.value);
            if (e.target.value) setKm(''); // Limpa raio se conselho selecionado
          }}
          style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #a5b4fc', minWidth: '140px', fontSize: '1.08rem', background: !distrito ? '#f3f3f3' : '#f8fafc', color: '#7c3aed', fontWeight: 600 }}
          disabled={!distrito}
        >
          <option value="">Conselho</option>
          {conselhos.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <select
          value={km}
          onChange={e => {
            setKm(e.target.value);
            if (e.target.value) {
              setDistrito('');
              setConselho('');
            }
          }}
          style={{ padding: '12px', borderRadius: '10px', border: '2px solid #fbbf24', minWidth: '140px', fontSize: '1.08rem', background: distrito || conselho ? '#f3f3f3' : '#fffbe8', color: '#7c3aed', fontWeight: 700 }}
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