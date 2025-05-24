import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cruzPino from '../assets/pino-cruz.png';

// corrige ícones padrão do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const cruzIcon = new L.Icon({
  iconUrl: cruzPino,
  iconSize: [28, 40],
  iconAnchor: [19, 45],
  popupAnchor: [0, -40],
});

export default function Mapa({ paroquias, coords }) {
  const [center, setCenter] = useState([41.14961, -8.61099]); // Porto centro

  useEffect(() => {
    if (coords) {
      setCenter([coords.latitude, coords.longitude]);
    }
  }, [coords]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcador do usuário */}
      {coords && (
        <Marker position={[coords.latitude, coords.longitude]}>
          <Popup>Sua localização</Popup>
        </Marker>
      )}

      {/* Marcadores das paróquias */}
      {paroquias.map(p => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={cruzIcon}>
          <Popup>
            <strong>{p.nome}</strong><br/>
            {p.endereco}<br/>
            {p.distancia && `${p.distancia.toFixed(1)} km`}
            
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
