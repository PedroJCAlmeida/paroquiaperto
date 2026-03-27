'use client';
import React, { useEffect } from 'react';
import { useMap, useMapEvents, MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Paroquia } from '@/types';

// Fix default Leaflet icon paths when bundled with Next.js/webpack.
// `_getIconUrl` is an internal property not exposed in @types/leaflet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
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

interface Coords {
  latitude: number;
  longitude: number;
}

function SetMapCenter({ coords }: { coords: Coords | null }) {
  const map = useMap();
  const prevCoords = React.useRef<Coords | undefined>(undefined);
  useEffect(() => {
    if (
      coords &&
      coords.latitude &&
      coords.longitude &&
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

function ReportBoundsToParent({ onBoundsChange }: { onBoundsChange?: (bounds: LatLngBounds) => void }) {
  const map = useMapEvents({
    moveend: () => { if (onBoundsChange) onBoundsChange(map.getBounds()); },
    zoomend: () => { if (onBoundsChange) onBoundsChange(map.getBounds()); },
  });
  useEffect(() => {
    if (map && onBoundsChange) onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);
  return null;
}

interface MapaProps {
  paroquias?: Paroquia[];
  coords?: Coords | null;
  onBoundsChange?: (bounds: LatLngBounds) => void;
  onMarkerDrag?: (lat: number, lng: number) => void; 
  isEditable?: boolean;
}

export default function Mapa({ paroquias = [], coords, onBoundsChange,onMarkerDrag, isEditable = false }: MapaProps) {
  const center: [number, number] = coords 
    ? [coords.latitude, coords.longitude] 
    : [41.14961, -8.61099];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom
    >
      <SetMapCenter coords={coords ?? null} />
      <ReportBoundsToParent onBoundsChange={onBoundsChange} />
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coords && (
        <Marker
          position={[coords.latitude, coords.longitude]}
          draggable={isEditable}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              if (onMarkerDrag) onMarkerDrag(position.lat, position.lng);
            },
          }}
          >
          <Popup>{isEditable ? "Arraste para ajustar o local exato" : "Sua localização"}</Popup>
        </Marker>
      )}
      {paroquias.map((p) => {
        const lat = parseFloat(p.lat);
        const lng = parseFloat(p.lng);
        if (isNaN(lat) || isNaN(lng)) return null;
        return (
          <Marker key={p.id} position={[lat, lng]} icon={cruzIcon}>
            <Popup>
              <strong>{p.nome}</strong>
              <br />
              {p.endereco}
              <br />
              {typeof p.distancia === 'number' ? `${p.distancia.toFixed(1)} km` : (p.distancia ?? '')}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
