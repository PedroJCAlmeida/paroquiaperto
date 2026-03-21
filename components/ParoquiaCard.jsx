'use client';
import React from 'react';
import '@/styles/ParoquiaCard.css';
import { MapPin } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function ParoquiaCard({ dados }) {
  const MySwal = withReactContent(Swal);
  const safeDados = {
    ...dados,
    horarios: Array.isArray(dados.horarios) ? dados.horarios : [],
  };

  const handleClick = () => {
    const { nome, imagem, endereco, distancia, horarios, descricao, contato, email, site, whatsapp, instagram, facebook } = safeDados;

    const html = `
      ${imagem ? `<img src="${imagem}" alt="${nome}" style="max-width:100%;border-radius:8px;margin-bottom:8px;" />` : ''}
      ${endereco ? `<p><strong>Endereço:</strong> ${endereco}</p>` : ''}
      ${distancia && distancia !== '-' ? `<p><strong>Distância:</strong> ${distancia} km</p>` : ''}
      ${descricao ? `<p><strong>Descrição:</strong> ${descricao}</p>` : ''}
      ${contato ? `<p><strong>Contato:</strong> ${contato}</p>` : ''}
      ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}" style="color:#545454">${email}</a></p>` : ''}
      ${site ? `<p><strong>Site:</strong> <a href="${site}" target="_blank" style="color:#545454">${site}</a></p>` : ''}
      <div style="margin:18px 0 0 0;display:flex;justify-content:center;">
        <a href="/paroquias/${safeDados.id}" style="padding:10px 24px;background:linear-gradient(90deg,#2563eb,#7c3aed);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Ver página</a>
      </div>
    `;

    MySwal.fire({
      title: `<strong>${nome}</strong>`,
      html,
      confirmButtonText: 'Fechar'
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
        <p><span className="paroquia-horario-label">Horários: </span></p>
        {safeDados.horarios.map((horario, index) => (
          <p key={index} className="paroquia-horario">
            {typeof horario === 'object' ? `${horario.diaSemana} ${horario.hora} - ${horario.tipo}` : horario}
          </p>
        ))}
      </div>
      <div className="saberMaisAreaButton" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div className="saberMais">
          <button className="saberMais-button" onPointerDown={handleClick}>Ver mais</button>
        </div>
        <a href={`/paroquias/${safeDados.id}`} className="saberMais-button" style={{ marginLeft: '4px' }}>
          Ver página
        </a>
      </div>
    </div>
  );
}
