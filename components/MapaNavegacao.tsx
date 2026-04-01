'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Map as MapIcon } from 'lucide-react';
import type { Paroquia } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), { ssr: false });

interface MapaNavegacaoProps {
  paroquia: Paroquia;
}

export default function MapaNavegacao({ paroquia }: MapaNavegacaoProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const lat = parseFloat(paroquia.lat);
  const lng = parseFloat(paroquia.lng);
  const hasValidCoords = !isNaN(lat) && !isNaN(lng);

  const navegarPara = (app: 'google' | 'apple' | 'waze' | 'here') => {
    if (!hasValidCoords) {
      alert('Localização não disponível');
      return;
    }

    const urls: { [key: string]: string } = {
      google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${paroquia.nome}`,
      apple: `maps://maps.apple.com/?daddr=${lat},${lng}`,
      waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
      here: `https://share.here.com/?map=${lat},${lng},15&x=adr`,
    };

    const url = urls[app];
    if (app === 'apple' && isMobile) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#243B55', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={24} style={{ color: '#A67C52' }} />
          Localização
        </h3>

        {hasValidCoords ? (
          <>
            {/* Mapa Interativo */}
            <div style={{ marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #BFDBFE' }}>
              <Mapa 
                paroquias={[paroquia]} 
                coords={null}
              />
            </div>

            {/* Botões de Navegação */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => navegarPara('google')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #4285F4 0%, #1967D2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(66, 133, 244, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.2)';
                }}
              >
                <Navigation size={18} />
                Google Maps
              </button>

              <button
                onClick={() => navegarPara('waze')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(102, 187, 106, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 187, 106, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 187, 106, 0.2)';
                }}
              >
                <Navigation size={18} />
                Waze
              </button>

              <button
                onClick={() => navegarPara('apple')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #1A1A1A 0%, #4A4A4A 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(26, 26, 26, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 26, 26, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(26, 26, 26, 0.3)';
                }}
              >
                <Navigation size={18} />
                Apple Maps
              </button>

              <button
                onClick={() => navegarPara('here')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #3366FF 0%, #1A4C9F 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(51, 102, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(51, 102, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(51, 102, 255, 0.2)';
                }}
              >
                <Navigation size={18} />
                HERE Maps
              </button>
            </div>

            {/* Info Card */}
            <div style={{
              background: '#F0F9FF',
              border: '1px solid #BFDBFE',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '0.9rem',
              color: '#243B55'
            }}>
              <strong>📍 Coordenadas:</strong> {lat.toFixed(4)}, {lng.toFixed(4)}
              <br />
              <strong>🏘️ Endereço:</strong> {
  paroquia ? (
    `${paroquia.rua}${paroquia.numeroPorta ? `, ${paroquia.numeroPorta}` : ''} - ${paroquia.codigoPostal} ${paroquia.localidade}`
  ) : 'Não informado'
}
            </div>
          </>
        ) : (
          <div style={{
            background: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
            color: '#92400E'
          }}>
            <strong>⚠️ Localização não disponível</strong>
            <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
              Esta paróquia ainda não tinha coordenadas de GPS registadas. 
              <br />
              Contacte os administradores para atualizar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

