
import React from 'react';
import { useParams } from 'react-router-dom';

const ParoquiaDetalhe = () => {
  const { id } = useParams();
  const [paroquia, setParoquia] = React.useState(null);
  const [horarios, setHorarios] = React.useState([]);
  const [eventos, setEventos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    Promise.all([
      fetch(`${apiUrl}/api/paroquias/${id}`).then(res => {
        if (!res.ok) throw new Error('Paróquia não encontrada');
        return res.json();
      }),
      fetch(`${apiUrl}/api/horarios`).then(res => res.json()),
      fetch(`${apiUrl}/api/eventos`).then(res => res.json())
    ])
      .then(([paroquiaData, horariosData, eventosData]) => {
        setParoquia(paroquiaData);
        setHorarios(horariosData.filter(h => h.paroquia && String(h.paroquia.id) === String(id)));
        setEventos(eventosData.filter(e => e.paroquia && String(e.paroquia.id) === String(id)));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (error) return <div className="p-6 text-red-600">Erro: {error}</div>;
  if (!paroquia) return <div className="p-6">Paróquia não encontrada.</div>;

  return (
    <div className="paroquia-detalhe-page" style={{ background: 'linear-gradient(135deg, #e3f0ff 0%, #f8fafc 100%)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="paroquia-detalhe-card" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '700px', margin: '0 auto', padding: '32px' }}>
        <h2 className="text-3xl font-bold text-blue-700 mb-6" style={{ textAlign: 'center' }}>{paroquia.nome}</h2>
        {paroquia.imagem && (
          <img src={paroquia.imagem} alt={paroquia.nome} style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
        )}
        <div style={{ marginBottom: '18px' }}>
          <p className="text-lg mb-2"><strong>Endereço:</strong> {paroquia.endereco}</p>
          <p className="text-lg mb-2"><strong>Descrição:</strong> {paroquia.descricao}</p>
          <p className="text-lg mb-2"><strong>Telefone:</strong> {paroquia.telefone}</p>
          <p className="text-lg mb-2"><strong>Email:</strong> {paroquia.email}</p>
          <p className="text-lg mb-2"><strong>Site:</strong> <a href={paroquia.site} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{paroquia.site}</a></p>
          <p className="text-lg mb-2"><strong>Whatsapp:</strong> {paroquia.whatsapp}</p>
        </div>
        <div style={{ marginBottom: '18px' }}>
          <strong>Redes sociais:</strong>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            {paroquia.instagram && <a href={paroquia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600">Instagram</a>}
            {paroquia.facebook && <a href={paroquia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600">Facebook</a>}
          </div>
        </div>
        <div style={{ marginBottom: '28px' }}>
          <strong className="block mb-2 text-blue-700 text-xl">Horários</strong>
          {horarios.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {horarios.map(h => (
                <li key={h.id} style={{ background: '#f1f5fb', borderRadius: '8px', marginBottom: '8px', padding: '10px 16px', fontSize: '1.08rem' }}>
                  <strong>{h.diaSemana}</strong> - {h.hora} <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{h.tipo}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#888' }}>Nenhum horário cadastrado.</p>
          )}
        </div>
        <div style={{ marginBottom: '18px' }}>
          <strong className="block mb-2 text-blue-700 text-xl">Eventos</strong>
          {eventos.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {eventos.map(e => (
                <li key={e.id} style={{ background: '#f9f5ff', borderRadius: '8px', marginBottom: '12px', padding: '12px 18px', fontSize: '1.08rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {e.imagem && <img src={e.imagem} alt={e.titulo} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />}
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: '#7c3aed' }}>{e.titulo}</strong>
                      <div style={{ fontSize: '0.98rem', color: '#444' }}>{e.data} às {e.hora}</div>
                      {e.descricao && <div style={{ marginTop: '4px', color: '#555' }}>{e.descricao}</div>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#888' }}>Nenhum evento cadastrado.</p>
          )}
        </div>
        <p className="text-gray-500 mt-4" style={{ textAlign: 'right', fontSize: '0.95rem' }}>ID: {paroquia.id}</p>
      </div>
    </div>
  );
}

export default ParoquiaDetalhe
