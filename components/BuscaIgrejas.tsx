'use client';
import React, { useState, useEffect } from 'react';
import '@/styles/BuscaIgrejas.css';
import type { Paroquia } from '@/types';

function BuscaIgrejas() {
  const [busca, setBusca] = useState('');
  const [allParoquias, setAllParoquias] = useState<Paroquia[]>([]);

  useEffect(() => {
    fetch('/api/paroquias')
      .then((res) => res.json())
      .then((data: Paroquia[]) => setAllParoquias(Array.isArray(data) ? data : []))
      .catch(() => setAllParoquias([]));
  }, []);

  const buscaTrim = busca.trim().toLowerCase();

  const igrejasFiltradas = buscaTrim
    ? allParoquias.filter((igreja) => {
        const nomeCombina = (igreja.nome ?? '').toLowerCase().includes(buscaTrim);
        const horarioCombina =
          Array.isArray(igreja.horarios) &&
          igreja.horarios.some((h) => {
            const texto =
              typeof h === 'object' ? `${h.diaSemana} ${h.hora} ${h.tipo}` : String(h);
            return texto.toLowerCase().includes(buscaTrim);
          });
        return nomeCombina || horarioCombina;
      })
    : [];

  return (
    <div className="container">
      <h2>Buscar Igrejas</h2>
      <form>
        <input
          type="text"
          placeholder="Digite o nome ou horário"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />
      </form>
      <div className="results-list-container">
        {buscaTrim && (
          <p className="results-message">
            {igrejasFiltradas.length > 0
              ? `Encontradas ${igrejasFiltradas.length} igrejas.`
              : 'Nenhuma igreja encontrada.'}
          </p>
        )}
        {buscaTrim &&
          igrejasFiltradas.map((p) => (
            <div key={p.id} className="church-item">
              {p.imagem && <img src={p.imagem} alt={p.nome} className="church-image" />}
              <div className="church-details">
                <h3>{p.nome}</h3>
                <p>
  <strong>Endereço:</strong> {`${p.rua}${p.numeroPorta ? `, ${p.numeroPorta}` : ''} - ${p.codigoPostal} ${p.localidade}`}
</p>
                <p>{p.descricao}</p>
                <strong>Horários:</strong>
                <ul className="church-hours-list">
                  {Array.isArray(p.horarios) &&
                    p.horarios.map((h, idx) => (
                      <li key={idx}>
                        {typeof h === 'object' ? `${h.diaSemana} ${h.hora} - ${h.tipo}` : String(h)}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default BuscaIgrejas;
