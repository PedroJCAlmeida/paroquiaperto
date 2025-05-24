import React, { useEffect, useState } from 'react';
import ParoquiaCard from '../components/ParoquiaCard';
import Mapa from '../components/Mapa';
import '../styles/Paroquias.css';
import json from '../assets/paroquias.json';


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
  const [lista, setLista] = useState([]);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLista(json);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ latitude, longitude });
        const ordenadas = json
          .map(p => ({
            ...p,
            distancia: calcularDistancia(latitude, longitude, p.lat, p.lng)
          }))
          .sort((a, b) => a.distancia - b.distancia);
        setLista(ordenadas);
      },
      () => {
        // usuário negou ou erro => exibe ordem original
        setLista(json);
      }
    );
  }, []);

  return (
    <div className="paroquias-page">
      <h2 className="paroquias-title">Paróquias Próximas</h2>

      {/* Mapa com Leaflet */}
      <div className="paroquias-mapa">
        <Mapa paroquias={lista} coords={coords} />
      </div>

      {/* Lista de cartões */}
      <div className="paroquias-lista">
        {lista.map(p => (
          <ParoquiaCard
            key={p.id}
            dados={{
              
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
