'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, MapPinned, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import type { Horario } from '@/types';
import '@/styles/ParoquiaCard.css';

export interface ParoquiaCardDados {
  id: number;
  nome: string;
  rua: string;
  numeroPorta?: string | null;
  codigoPostal: string;
  localidade: string;
  distancia?: string;
  descricao?: string | null;
  horarios?: Horario[];
  email?: string | null;
  site?: string | null;
  imagem?: string | null;
  lat?: string;
  lng?: string;
}

export default function ParoquiaCard({ dados }: { dados: ParoquiaCardDados }) {
  const router = useRouter();
  const MySwal = withReactContent(Swal);
  
  // 1. Garantir que os dados são seguros
  const safeDados = useMemo(() => ({
    ...dados,
    horarios: Array.isArray(dados.horarios) ? dados.horarios : [],
  }), [dados]);

  // 2. Lógica de Agrupamento de Horários para o Card (Compacta)
  const horariosAgrupados = useMemo(() => {
    const groups = safeDados.horarios.reduce((acc: { [key: string]: string[] }, curr) => {
      const dia = curr.diaSemana;
      if (!acc[dia]) acc[dia] = [];
      // Evitar duplicados no mesmo dia
      if (!acc[dia].includes(curr.hora)) acc[dia].push(curr.hora);
      return acc;
    }, {});
    return Object.entries(groups);
  }, [safeDados.horarios]);

  const moradaExibir = `${safeDados.rua}${safeDados.numeroPorta ? `, ${safeDados.numeroPorta}` : ''} - ${safeDados.codigoPostal} ${safeDados.localidade}`;

  const abrirNoMaps = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const moradaBusca = `${safeDados.rua}, ${safeDados.numeroPorta || ''}, ${safeDados.codigoPostal} ${safeDados.localidade}`;
    const query = (safeDados.lat && safeDados.lng) 
      ? `${safeDados.lat},${safeDados.lng}` 
      : encodeURIComponent(moradaBusca);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const mostrarPopupInfo = () => {
    MySwal.fire({
      title: `<span style="color: #243B55; font-weight: 900;">${safeDados.nome}</span>`,
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          ${safeDados.imagem ? `<img src="${safeDados.imagem}" style="width:100%; border-radius:12px; margin-bottom:15px; height:200px; object-fit:cover;" />` : ''}
          <p style="margin-bottom: 8px;"><strong>📍 Endereço:</strong> ${moradaExibir}</p>
          ${safeDados.distancia && safeDados.distancia !== '-' ? `<p><strong>📏 Distância:</strong> ${safeDados.distancia} km</p>` : ''}
          ${safeDados.descricao ? `<p style="background: #f8fafc; padding: 10px; border-radius: 8px; border-left: 4px solid #A67C52; font-size: 0.9rem;">${safeDados.descricao}</p>` : ''}
        </div>
      `,
      confirmButtonText: 'Fechar',
      confirmButtonColor: '#243B55',
      customClass: { popup: 'border-radius-20' }
    });
  };

  return (
    <div className="paroquia-card" style={{
      background: '#fff',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'transform 0.2s ease'
    }}>
      {/* IMAGEM */}
      <div style={{ position: 'relative', height: '160px' }}>
        <img 
          src={safeDados.imagem || "/logo_paroquia.png"} 
          alt={safeDados.nome} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {safeDados.distancia && safeDados.distancia !== '-' && (
          <div className="distancia-badge" style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(255,255,255,0.9)', padding: '4px 10px',
            borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800',
            color: '#A67C52', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            {safeDados.distancia} km
          </div>
        )}
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* TÍTULO COM ALTURA MÍNIMA PARA ALINHAMENTO */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#243B55', marginBottom: '8px', minHeight: '2.5rem' }}>
          {safeDados.nome}
        </h3>
        
        {/* MORADA */}
        <p style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '15px', minHeight: '3rem' }}>
          <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> 
          {moradaExibir}
        </p>

        {/* ÁREA DE HORÁRIOS COMPACTA */}
        <div style={{ 
          flex: 1, 
          background: '#f8fafc', 
          padding: '12px', 
          borderRadius: '12px', 
          marginBottom: '20px',
          border: '1px solid #f1f5f9'
        }}>
          <span style={{ fontSize: '0.65rem', color: '#A67C52', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
            Próximas Missas
          </span>
          
          {horariosAgrupados.length > 0 ? (
            horariosAgrupados.slice(0, 2).map(([dia, horas]) => (
              <div key={dia} style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>{dia}:</span>
                <span style={{ textAlign: 'right' }}>{horas.join(', ')}</span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Sem horários registados</p>
          )}

          {horariosAgrupados.length > 2 && (
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '4px 0 0 0', fontStyle: 'italic', textAlign: 'right' }}>
              + ver todos
            </p>
          )}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button onClick={mostrarPopupInfo} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
            <Info size={18} color="#243B55" style={{ margin: '0 auto' }} />
          </button>

          <button onClick={abrirNoMaps} style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer' }}>
            <MapPinned size={18} color="#243B55" style={{ margin: '0 auto' }} />
          </button>

          <button 
            onClick={() => router.push(`/paroquias/${safeDados.id}`)}
            style={{ 
              flex: 3, padding: '10px', 
              background: 'linear-gradient(135deg, #243B55, #3E5C76)', 
              color: '#fff', border: 'none', borderRadius: '10px', 
              fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' 
            }}
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
