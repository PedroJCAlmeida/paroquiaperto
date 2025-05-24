import React, { useState } from 'react';
import json from '../assets/paroquias.json';
import '../styles/BuscaIgrejas.css';

function BuscaIgrejas() {
  const [busca, setBusca] = useState('');

  const buscaTrim = busca.trim().toLowerCase();

  const igrejasFiltradas = buscaTrim
    ? json.filter((igreja) => {
      const nomeCombina = igreja.nome.toLowerCase().includes(buscaTrim);
      const horarioCombina = igreja.horarios?.some((h) =>
        h.toLowerCase().includes(buscaTrim)
      );
      return nomeCombina || horarioCombina;
    })
    : [];

  return (
    <div className='container'>
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
              : `Nenhuma igreja encontrada.`}
          </p>
        )}
        {buscaTrim &&
          igrejasFiltradas.map((p) => (
            <div
              key={p.id}
              className="church-item"
            >
              {p.imagem && <img src={p.imagem} alt={p.nome} className="church-image" />}

              <div className="church-details">
                <h3>{p.nome}</h3>
                <p>
                  <strong>Endereço:</strong> {p.endereco}
                </p>
                <p>{p.descricao}</p>
                <strong>Horários:</strong>
                <ul className="church-hours-list">
                  {p.horarios.map((h, idx) => (
                    <li key={idx}>{h}</li>
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