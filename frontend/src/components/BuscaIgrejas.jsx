import React, { useState } from 'react';
import json from '../assets/paroquias.json';
import '../styles/BuscaIgrejas.css'; // Importando o CSS para estilização

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
    <div className='container' style={{ padding: '2rem' }}>
      <h2>Buscar Igrejas</h2>

      <form>
        <input
          type="text"
          placeholder="Digite o nome ou horário"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '10px', fontSize: '16px' }}
        />
      </form>

      <div style={{ marginTop: '2rem' }}>
        
        {buscaTrim && (
          <p>
            {igrejasFiltradas.length > 0
              ? `Encontradas ${igrejasFiltradas.length} igrejas.`
              : `Nenhuma igreja encontrada.`}
            
          </p>
        )}
        {buscaTrim &&
          igrejasFiltradas.map((p) => (
            
            <div
              key={p.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
        
              {p.imagem && <img src={p.imagem} alt={p.nome} style={{ width: '100%', maxWidth: '250px', objectFit: 'cover', height: 'auto', borderRadius: '4px' }} />}
              
              <div>
                <h3>{p.nome}</h3>
                <p>
                  <strong>Endereço:</strong> {p.endereco}
                </p>
                <p>{p.descricao}</p>
                <strong>Horários:</strong>
                <ul>
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
