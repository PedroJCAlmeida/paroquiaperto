
import React from 'react';
import { useParams } from 'react-router-dom';
import logo from '../assets/logo.png';

const ParoquiaDetalhe = () => {
  const { id } = useParams();
  const [paroquia, setParoquia] = React.useState(null);
  const [horarios, setHorarios] = React.useState([]);
  const [eventos, setEventos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const safeJson = async (res) => {
      if (!res.ok) return [];
      try {
        return await res.json();
      } catch {
        return [];
      }
    };
    Promise.all([
      fetch(`${apiUrl}/api/paroquias/${id}`).then(res => {
        if (!res.ok) throw new Error('Paróquia não encontrada');
        return res.json();
      }),
      fetch(`${apiUrl}/api/horarios`).then(safeJson),
      fetch(`${apiUrl}/api/eventos`).then(safeJson)
    ])
      .then(([paroquiaData, horariosData, eventosData]) => {
        setParoquia(paroquiaData);
        // Aceita tanto h.paroquia.id quanto h.paroquia_id
        setHorarios(Array.isArray(horariosData)
          ? horariosData.filter(h =>
              (h.paroquia && String(h.paroquia.id) === String(id)) ||
              (h.paroquia_id && String(h.paroquia_id) === String(id))
            )
          : []);
        setEventos(Array.isArray(eventosData)
          ? eventosData.filter(e =>
              (e.paroquia && String(e.paroquia.id) === String(id)) ||
              (e.paroquia_id && String(e.paroquia_id) === String(id))
            )
          : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Loader visual
  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
            <circle cx="24" cy="24" r="20" stroke="#2563eb" strokeWidth="6" strokeDasharray="31 31" />
          </svg>
          <div style={{ marginTop: '16px', color: '#2563eb', fontWeight: 'bold' }}>Carregando dados...</div>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Mensagem de erro amigável
  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" stroke="#ef4444" strokeWidth="6" />
            <line x1="16" y1="16" x2="32" y2="32" stroke="#ef4444" strokeWidth="4" />
            <line x1="32" y1="16" x2="16" y2="32" stroke="#ef4444" strokeWidth="4" />
          </svg>
          <div style={{ marginTop: '16px', color: '#ef4444', fontWeight: 'bold' }}>Erro ao carregar dados</div>
          <div style={{ color: '#888', marginTop: '8px' }}>{error}</div>
        </div>
      </div>
    );
  }

  // ...existing code...
  return (
    <div className="paroquia-detalhe-page" style={{ background: 'linear-gradient(135deg, #e3f0ff 0%, #f8fafc 100%)', minHeight: '100vh', padding: '24px 0' }}>
      <div className="paroquia-detalhe-card" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '700px', margin: '0 auto', padding: '24px', width: '95vw', minWidth: '0' }}>
        <button
          onClick={() => window.history.back()}
          className="transition-colors duration-150 mb-4 px-5 py-2 rounded-lg font-semibold text-white bg-blue-700 hover:bg-blue-800 shadow"
          style={{ outline: 'none', border: 'none' }}
        >
          ← Voltar para lista
        </button>
        {/* Header */}
        <h2 className="text-3xl font-bold text-blue-700 mb-6" style={{ textAlign: 'center' }}>{paroquia?.nome || 'Nome da Paróquia'}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
          {paroquia?.imagem ? (
            <img src={paroquia.imagem} alt={paroquia.nome} style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', maxHeight: '220px' }} />
          ) : (
            <img src={logo} alt="Imagem padrão igreja" style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '12px', background: '#e0e7ef', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
          )}
        </div>
        {/* Dados principais */}
  <div style={{ marginBottom: '18px', display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }} className="paroquia-detalhe-info-grid">
          <style>{`
            @media (min-width: 600px) {
              .paroquia-detalhe-card { padding: 32px; }
              .paroquia-detalhe-info-grid { grid-template-columns: 1fr 1fr; }
            }
            @media (max-width: 599px) {
              .paroquia-detalhe-card { padding: 16px; }
              .paroquia-detalhe-info-grid { grid-template-columns: 1fr; }
              .paroquia-detalhe-page { padding: 8px 0; }
            }
          `}</style>
          <div>
            <p className="text-lg mb-2"><strong>Endereço:</strong> {
              paroquia?.endereco
                ? <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(paroquia.endereco)}`}
                     target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>{paroquia.endereco}</a>
                : <span style={{ color: '#bbb' }}>Não informado</span>
            }</p>
            <p className="text-lg mb-2"><strong>Descrição:</strong> {paroquia?.descricao || <span style={{ color: '#bbb' }}>Não informado</span>}</p>
            <p className="text-lg mb-2"><strong>Telefone:</strong> {
              paroquia?.telefone
                ? <a href={`tel:${paroquia.telefone.replace(/\D/g, '')}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>{paroquia.telefone}</a>
                : <span style={{ color: '#bbb' }}>Não informado</span>
            }</p>
            <p className="text-lg mb-2"><strong>Email:</strong> {
              paroquia?.email
                ? <a href={`mailto:${paroquia.email}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>{paroquia.email}</a>
                : <span style={{ color: '#bbb' }}>Não informado</span>
            }</p>
          </div>
          <div>
            <p className="text-lg mb-2"><strong>Site:</strong> {paroquia?.site ? <a href={paroquia.site} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{paroquia.site}</a> : <span style={{ color: '#bbb' }}>Não informado</span>}</p>
            <p className="text-lg mb-2"><strong>Whatsapp:</strong> {
              paroquia?.whatsapp
                ? <a href={`https://wa.me/${paroquia.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', textDecoration: 'underline' }}>{paroquia.whatsapp}</a>
                : <span style={{ color: '#bbb' }}>Não informado</span>
            }</p>
            <div style={{ marginTop: '8px' }}>
              <strong>Redes sociais:</strong>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                {paroquia?.instagram ? <a href={paroquia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600">Instagram</a> : <span style={{ color: '#bbb' }}>Instagram</span>}
                {paroquia?.facebook ? <a href={paroquia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600">Facebook</a> : <span style={{ color: '#bbb' }}>Facebook</span>}
              </div>
            </div>
          </div>
        </div>
        {/* Horários */}
        <div style={{ marginBottom: '28px' }}>
          <strong className="block mb-2 text-blue-700 text-xl" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
            Horários
          </strong>
          {horarios.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {horarios.map(h => (
                <li key={h.id} style={{ background: '#f1f5fb', borderRadius: '8px', marginBottom: '8px', padding: '10px 16px', fontSize: '1.08rem' }}>
                  <strong>{h.diaSemana || h.dia_semana}</strong> - {h.hora || h.hora} <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{h.tipo || h.tipo}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#bbb' }}>Nenhum horário cadastrado.</p>
          )}
        </div>
        {/* Eventos */}
        <div style={{ marginBottom: '18px' }}>
          <strong className="block mb-2 text-blue-700 text-xl" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><rect x="3" y="5" width="18" height="16" rx="2" stroke="#7c3aed" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/></svg>
            Eventos
          </strong>
          {eventos.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {eventos.map(e => (
                <li key={e.id} style={{ background: '#f9f5ff', borderRadius: '8px', marginBottom: '12px', padding: '12px 18px', fontSize: '1.08rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {(e.imagem || e.imagem_evento) ? (
                      <img src={e.imagem || e.imagem_evento} alt={e.titulo || e.titulo_evento} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <img src={logo} alt="Imagem padrão igreja" style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px', background: '#e0e7ef' }} />
                    )}
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: '#7c3aed' }}>{e.titulo || e.titulo_evento || 'Evento'}</strong>
                      <div style={{ fontSize: '0.98rem', color: '#444' }}>{(e.data || e.data_evento) ? `${e.data || e.data_evento} às ${(e.hora || e.hora_evento)}` : 'Data não informada'}</div>
                      {(e.descricao || e.descricao_evento) ? <div style={{ marginTop: '4px', color: '#555' }}>{e.descricao || e.descricao_evento}</div> : <div style={{ marginTop: '4px', color: '#bbb' }}>Sem descrição</div>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#bbb' }}>Nenhum evento cadastrado.</p>
          )}
        </div>
        {/* Rodapé removido: ID não será exibido */}
      </div>
    </div>
  );
}

export default ParoquiaDetalhe; 
