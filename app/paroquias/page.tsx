'use client';
import React from 'react';
import '@/styles/ParoquiaCard.css';
import { MapPin, MapPinned, Info, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import type { Horario } from '@/types';

export interface ParoquiaCardDados {
  id: number;
  nome: string;
  endereco: string;
  distancia?: string;
  descricao?: string | null;
  horarios?: Horario[];
  email?: string | null;
  site?: string | null;
  imagem?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
  lat?: string;
  lng?: string;
}

export default function ParoquiaCard({ dados }: { dados: ParoquiaCardDados }) {
  const MySwal = withReactContent(Swal);
  const safeDados = {
    ...dados,
    horarios: Array.isArray(dados.horarios) ? dados.horarios : [],
  };

  const abrirNoMaps = (e?: React.MouseEvent | React.PointerEvent) => {
    if (e) e.stopPropagation();
    const query = (safeDados.lat && safeDados.lng) 
      ? `${safeDados.lat},${safeDados.lng}` 
      : encodeURIComponent(safeDados.endereco);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  const handleClick = () => {
    const { nome, imagem, endereco, distancia, descricao, email, site } = safeDados;

    const html = `
      <div style="text-align: left; font-family: sans-serif;">
        ${imagem ? `<img src="${imagem}" alt="${nome}" style="width:100%; height:200px; object-fit:cover; border-radius:12px; margin-bottom:15px; border: 1px solid #eee;" />` : ''}
        <p style="margin-bottom: 8px;"><strong>📍 Endereço:</strong> ${endereco}</p>
        ${distancia && distancia !== '-' ? `<p style="margin-bottom: 8px;"><strong>📏 Distância:</strong> ${distancia} km</p>` : ''}
        ${descricao ? `<p style="margin-bottom: 8px; color: #666;">${descricao}</p>` : ''}
        ${email ? `<p style="margin-bottom: 8px;"><strong>📧 Email:</strong> ${email}</p>` : ''}
        
        <div style="margin-top:25px; display:flex; flex-direction:column; gap:10px;">
          <a href="/paroquias/${safeDados.id}" 
             style="display:flex; align-items:center; justify-content:center; gap:8px; padding:14px; background:linear-gradient(135deg,#243B55,#3E5C76); color:#fff; border-radius:10px; text-decoration:none; font-weight:bold;">
             Ver Página Completa
          </a>
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${safeDados.lat && safeDados.lng ? `${safeDados.lat},${safeDados.lng}` : encodeURIComponent(endereco)}', '_blank')" 
                  style="display:flex; align-items:center; justify-content:center; gap:8px; padding:14px; background:#f1f5f9; color:#243B55; border:1px solid #e2e8f0; border-radius:10px; font-weight:bold; cursor:pointer;">
             📍 Como Chegar (GPS)
          </button>
        </div>
      </div>
    `;

    MySwal.fire({
      title: `<span style="color: #243B55; font-weight: 900;">${nome}</span>`,
      html,
      showConfirmButton: false,
      showCloseButton: true,
      width: '450px'
    });
  };

  return (
    <div className="paroquia-card">
      <div className="paroquia-card-interno">
        <h3>{safeDados.nome}</h3>
        <p><MapPin size={16} /> {safeDados.endereco}</p>
        
        {safeDados.distancia && safeDados.distancia !== '-' && (
          <span className="paroquia-distancia">{safeDados.distancia} km</span>
        )}

        <div style={{ marginTop: '12px' }}>
          <p><span className="paroquia-horario-label">Horários: </span></p>
          {safeDados.horarios.slice(0, 2).map((horario, index) => (
            <p key={index} className="paroquia-horario">
              {typeof horario === 'object'
                ? `${horario.diaSemana} ${horario.hora} - ${horario.tipo}`
                : String(horario)}
            </p>
          ))}
          {safeDados.horarios.length > 2 && <p className="paroquia-horario" style={{opacity: 0.5, fontSize: '0.8rem'}}>Clique em "Ver mais" para lista completa</p>}
        </div>
      </div>

      {/* ÁREA DE BOTÕES PADRONIZADA */}
      <div className="saberMaisAreaButton" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '8px', 
        marginTop: '15px' 
      }}>
        {/* BOTÃO 1: VER MAIS (Abre Modal) */}
        <button 
          className="saberMais-button" 
          onPointerDown={handleClick}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <Info size={16} /> Ver mais
        </button>
        
        {/* BOTÃO 2: VER PÁGINA (Link Direto) */}
        <a 
          href={`/paroquias/${safeDados.id}`} 
          className="saberMais-button"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <ExternalLink size={16} /> Página
        </a>

        {/* BOTÃO 3: ROTA (Ocupa a largura total na segunda linha do grid interno) */}
        <button 
          onClick={abrirNoMaps} 
          className="saberMais-button" 
          style={{ 
            gridColumn: '1 / -1',
            background: '#f1f5f9', 
            color: '#243B55', 
            border: '1px solid #e2e8f0',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <MapPinned size={18} /> Como Chegar
        </button>
      </div>
    </div>
  );
}