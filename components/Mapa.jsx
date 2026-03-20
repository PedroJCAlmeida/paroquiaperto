'use client';
import React, { useEffect, useState } from 'react';
import { useMap, useMapEvents, MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const cruzIcon = new L.Icon({
  iconUrl: '/pino-cruz.png',
  iconSize: [28, 40],
  iconAnchor: [19, 45],
  popupAnchor: [0, -40],
});

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

function ReportBoundsToParent({ onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => { if (onBoundsChange) onBoundsChange(map.getBounds()); },
    zoomend: () => { if (onBoundsChange) onBoundsChange(map.getBounds()); }
  });
  useEffect(() => {
    if (map && onBoundsChange) onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);
  return null;
}

export default function Mapa({ paroquias = [], coords, onBoundsChange }) {
  const center = [41.14961, -8.61099];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom
    >
      <SetMapCenter coords={coords} />
      <ReportBoundsToParent onBoundsChange={onBoundsChange} />
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coords && (
        <Marker position={[coords.latitude, coords.longitude]}>
          <Popup>Sua localização</Popup>
        </Marker>
      )}
      {paroquias.map(p => {
        const lat = parseFloat(p.lat);
        const lng = parseFloat(p.lng);
        if (isNaN(lat) || isNaN(lng)) return null;
        return (
          <Marker key={p.id} position={[lat, lng]} icon={cruzIcon}>
            <Popup>
              <strong>{p.nome}</strong><br />
              {p.endereco}<br />
              {typeof p.distancia === 'number' ? `${p.distancia.toFixed(1)} km` : p.distancia || ''}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
