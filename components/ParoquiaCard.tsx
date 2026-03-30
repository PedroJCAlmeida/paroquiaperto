'use client';
import React from 'react';
import '@/styles/ParoquiaCard.css';
import { MapPin, MapPinned } from 'lucide-react'; // Importado MapPinned para o ícone de rota
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

  // Função utilitária para abrir o Google Maps
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
      ${imagem ? `<img src="${imagem}" alt="${nome}" style="max-width:100%;border-radius:8px;margin-bottom:8px;" />` : ''}
      ${endereco ? `<p><strong>Endereço:</strong> ${endereco}</p>` : ''}
      ${distancia && distancia !== '-' ? `<p><strong>Distância:</strong> ${distancia} km</p>` : ''}
      ${descricao ? `<p><strong>Descrição:</strong> ${descricao}</p>` : ''}
      ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}" style="color:#545454">${email}</a></p>` : ''}
      ${site ? `<p><strong>Site:</strong> <a href="${site}" target="_blank" style="color:#545454">${site}</a></p>` : ''}
      <div style="margin:18px 0 0 0;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
        <a href="/paroquias/${safeDados.id}" style="padding:10px 20px;background:linear-gradient(135deg,#243B55,#3E5C76);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">Ver página completa</a>
        <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${safeDados.lat && safeDados.lng ? `${safeDados.lat},${safeDados.lng}` : encodeURIComponent(endereco)}', '_blank')" style="padding:10px 20px;background:#f1f5f9;color:#243B55;border:1px solid #e2e8f0;border-radius:8px;font-weight:bold;cursor:pointer;font-size:14px;">Como chegar</button>
      </div>
    `;

    MySwal.fire({
      title: `<strong>${nome}</strong>`,
      html,
      showConfirmButton: false,
      showCloseButton: true,
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

        <div style={{ marginTop: '8px' }}>
            <p><span className="paroquia-horario-label">Horários: </span></p>
            {safeDados.horarios.slice(0, 3).map((horario, index) => (
            <p key={index} className="paroquia-horario">
                {typeof horario === 'object'
                ? `${horario.diaSemana} ${horario.hora} - ${horario.tipo}`
                : String(horario)}
            </p>
            ))}
            {safeDados.horarios.length > 3 && <p className="paroquia-horario" style={{opacity: 0.6}}>...</p>}
        </div>
      </div>

      <div className="saberMaisAreaButton" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
        <button className="saberMais-button" onPointerDown={handleClick}>
          Ver mais
        </button>
        
        <a href={`/paroquias/${safeDados.id}`} className="saberMais-button">
          Página
        </a>

        {/* NOVO BOTÃO DE ROTA DIRETA */}
        <button 
          onClick={abrirNoMaps} 
          className="saberMais-button" 
          style={{ 
            background: '#f1f5f9', 
            color: '#243B55', 
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <MapPinned size={14} /> Rota
        </button>
      </div>
    </div>
  );
}