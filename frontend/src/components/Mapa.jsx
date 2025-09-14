import React, { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { useMap } from 'react-leaflet';
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

export default function Mapa({ paroquias, coords, onBoundsChange }) {
  const [center, setCenter] = useState([41.14961, -8.61099]); // Porto centro

  function SetMapCenter({ coords }) {
    const map = useMap();
    const prevCoords = React.useRef();
    useEffect(() => {
    if (
        coords && coords.latitude && coords.longitude &&
        (!prevCoords.current ||
          prevCoords.current.latitude !== coords.latitude ||
          prevCoords.current.longitude !== coords.longitude)
      ) {
        map.setView([coords.latitude, coords.longitude], 13);
        prevCoords.current = coords;
      }
    }, [coords, map]);
    return null;
  }

  function ReportBoundsToParent() {
    const map = useMapEvents({
      moveend: () => {
        if (onBoundsChange) onBoundsChange(map.getBounds());
      },
      zoomend: () => {
        if (onBoundsChange) onBoundsChange(map.getBounds());
      }
    });
    useEffect(() => {
      if (map && onBoundsChange) {
        onBoundsChange(map.getBounds());
      }
    }, [map, onBoundsChange]);
    return null;
  }

  return (
    <MapContainer
      defaultCenter={center}
      zoom={13}
      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom
    >
      <SetMapCenter coords={coords} />
  <ReportBoundsToParent />
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

      {/* Marcadores das paróquias visíveis */}
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
