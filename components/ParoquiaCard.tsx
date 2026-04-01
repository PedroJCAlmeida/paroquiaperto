'use client';
import React from 'react';
import '@/styles/ParoquiaCard.css';
import { MapPin, MapPinned, Info, Globe } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import type { Horario } from '@/types';
import { useRouter } from 'next/navigation';

export interface ParoquiaCardDados {
  id: number;
  nome: string;
  rua: string;           // Adicionado
  numeroPorta?: string | null; // Adicionado
  codigoPostal: string;  // Adicionado
  localidade: string;    // Adicionado
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
  
  const safeDados = {
    ...dados,
    horarios: Array.isArray(dados.horarios) ? dados.horarios : [],
  };

  const abrirNoMaps = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // 1. Criamos a string da morada combinando os novos campos
    const moradaParaBusca = `${safeDados.rua}${safeDados.numeroPorta ? `, ${safeDados.numeroPorta}` : ''}, ${safeDados.codigoPostal} ${safeDados.localidade}`;

    // 2. Definimos se a busca será por Coordenadas (mais preciso) ou por Texto
    const query = (safeDados.lat && safeDados.lng) 
      ? `${safeDados.lat},${safeDados.lng}` 
      : encodeURIComponent(moradaParaBusca);

    // 3. Corrigimos a sintaxe do URL (adicionando o '$' antes da chaveta)
    // O link padrão recomendado é o https://www.google.com/maps/search/?api=1&query=
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };
  const mostrarPopupInfo = () => {
    const { 
      nome, 
      imagem, 
      rua, 
      numeroPorta, 
      codigoPostal, 
      localidade, 
      distancia, 
      descricao, 
      email, 
      site 
    } = safeDados;

    const moradaExibir = `${rua}${numeroPorta ? `, ${numeroPorta}` : ''} - ${codigoPostal} ${localidade}`;
    
    MySwal.fire({
      title: `<span style="color: #243B55; font-weight: 900;">${nome}</span>`,
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          ${imagem ? `<img src="${imagem}" style="width:100%; border-radius:12px; margin-bottom:15px; height:200px; object-fit:cover;" />` : ''}
          <p style="margin-bottom: 8px;"><strong>📍 Endereço:</strong> ${moradaExibir}</p>
          ${distancia && distancia !== '-' ? `<p><strong>📏 Distância:</strong> ${distancia} km</p>` : ''}
          ${descricao ? `<p style="background: #f8fafc; padding: 10px; border-radius: 8px; border-left: 4px solid #A67C52;">${descricao}</p>` : ''}
          <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 5px;">
            ${email ? `<span>📧 ${email}</span>` : ''}
            ${site ? `<a href="${site}" target="_blank" style="color: #3E5C76; text-decoration: none;">🌐 Visitar Site Oficial</a>` : ''}
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Fechar',
      confirmButtonColor: '#243B55',
      showCloseButton: true,
      customClass: {
        popup: 'border-radius-20'
      }
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
      transition: 'transform 0.2s ease'
    }}>
      {/* IMAGEM E BADGE DE DISTÂNCIA */}
      <div style={{ position: 'relative', height: '160px' }}>
        <img 
          src={safeDados.imagem || "/logo_paroquia.png"} 
          alt={safeDados.nome} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {safeDados.distancia && safeDados.distancia !== '-' && (
          <div style={{
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
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#243B55', marginBottom: '8px' }}>
          {safeDados.nome}
        </h3>
        
        <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '15px' }}>
          <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> {safeDados.endereco}
        </p>

        {/* ÁREA DE HORÁRIOS RESUMIDA */}
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.7rem', color: '#A67C52', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Próximas Missas
          </span>
          <div style={{ marginTop: '5px' }}>
            {safeDados.horarios.slice(0, 2).map((h, i) => (
              <p key={i} style={{ fontSize: '0.85rem', color: '#334155', margin: '2px 0' }}>
                • {typeof h === 'object' ? `${h.diaSemana}: ${h.hora}` : String(h)}
              </p>
            ))}
            {safeDados.horarios.length > 2 && (
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>+ ver outros horários</p>
            )}
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={mostrarPopupInfo}
            style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#243B55' }}
            title="Informações Rápidas"
          >
            <Info size={18} style={{ margin: '0 auto' }} />
          </button>

          <button 
            onClick={abrirNoMaps}
            style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', color: '#243B55' }}
            title="Ver Rota"
          >
            <MapPinned size={18} style={{ margin: '0 auto' }} />
          </button>

          <button 
            onClick={() => router.push(`/paroquias/${safeDados.id}`)}
            className="card-main-button"
            style={{ 
              flex: 3, padding: '10px', 
              background: 'linear-gradient(135deg, #243B55, #3E5C76)', 
              color: '#fff', border: 'none', borderRadius: '10px', 
              fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' 
            }}
          >
            Página Detalhada
          </button>
        </div>
      </div>
    </div>
  );
}
