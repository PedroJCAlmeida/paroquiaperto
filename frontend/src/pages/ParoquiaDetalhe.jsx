
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
    <div className="paroquia-detalhe-page" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="paroquia-detalhe-card" style={{ background: '#fff', borderRadius: '28px', boxShadow: '0 8px 40px rgba(60,60,120,0.13)', maxWidth: '760px', margin: '0 auto', padding: '38px', width: '95vw', minWidth: '0', border: '2px solid #e0e7ff' }}>
        <button
          onClick={() => window.history.back()}
          className="saberMais-button"
          style={{ outline: 'none', border: 'none', marginBottom: '22px', padding: '12px 28px', fontWeight: 900, fontSize: '1.08rem', borderRadius: '12px', background: 'linear-gradient(90deg,#2563eb 0%,#7c3aed 100%)', color: '#fff', boxShadow: '0 2px 12px rgba(99,102,241,0.13)' }}
        >
          ← Voltar para lista
        </button>
        {/* Header */}
        <h2 className="text-3xl font-bold text-blue-700 mb-6" style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 900, color: '#2563eb', letterSpacing: '1.2px', marginBottom: 18, textShadow: '0 2px 16px #e0e7ff' }}>{paroquia?.nome || 'Nome da Paróquia'}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '28px' }}>
          {paroquia?.imagem ? (
            <img src={paroquia.imagem} alt={paroquia.nome} style={{ maxWidth: '100%', borderRadius: '18px', boxShadow: '0 4px 18px rgba(124,58,237,0.13)', maxHeight: '260px', border: '2px solid #fbbf24' }} />
          ) : (
            <img src={logo} alt="Imagem padrão igreja" style={{ width: '130px', height: '130px', objectFit: 'contain', borderRadius: '18px', background: '#e0e7ef', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '2px solid #fbbf24' }} />
          )}
        </div>
        {/* Dados principais */}
        <div style={{ marginBottom: '22px', display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="paroquia-detalhe-info-grid">
          <style>{`
            @media (min-width: 600px) {
              .paroquia-detalhe-card { padding: 48px; }
              .paroquia-detalhe-info-grid { grid-template-columns: 1fr 1fr; }
            }
            @media (max-width: 599px) {
              .paroquia-detalhe-card { padding: 18px; }
              .paroquia-detalhe-info-grid { grid-template-columns: 1fr; }
              .paroquia-detalhe-page { padding: 12px 0; }
            }
          `}</style>
          <div>
            <p className="text-lg mb-2"><strong style={{ color: '#2563eb' }}>Endereço:</strong> {
              paroquia?.endereco
                ? <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(paroquia.endereco)}`}
                     target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'underline', fontWeight: 700 }}>{paroquia.endereco}</a>
                : <span style={{ color: '#bbb' }}>Não informado</span>
            }</p>
            <p className="text-lg mb-2"><strong style={{ color: '#2563eb' }}>Descrição:</strong> {paroquia?.descricao || <span style={{ color: '#bbb' }}>Não informado</span>}</p>
            <p className="text-lg mb-2"><strong style={{ color: '#2563eb' }}>Telefone:</strong> {
              paroquia?.telefone
                ? <a href={`tel:${paroquia.telefone.replace(/\D/g, '')}`} style={{ color: '#fbbf24', textDecoration: 'underline', fontWeight: 700 }}>{paroquia.telefone}</a>
                : <span style={{ color: '#bbb' }}>Não informado</span>
            }</p>
            <p className="text-lg mb-2"><strong style={{ color: '#2563eb' }}>Email:</strong> {
              paroquia?.email
                ? <a href={`mailto:${paroquia.email}`} style={{ color: '#7c3aed', textDecoration: 'underline', fontWeight: 700 }}>{paroquia.email}</a>
                : <span style={{ color: '#bbb' }}>Não informado</span>
            }</p>
          </div>
          <div>
            <p className="text-lg mb-2"><strong style={{ color: '#2563eb' }}>Site:</strong> {paroquia?.site ? <a href={paroquia.site} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 700 }}>{paroquia.site}</a> : <span style={{ color: '#bbb' }}>Não informado</span>}</p>
            <p className="text-lg mb-2"><strong style={{ color: '#2563eb' }}>Whatsapp:</strong> {
              paroquia?.whatsapp
                ? <a href={`https://wa.me/${paroquia.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', textDecoration: 'underline', fontWeight: 700 }}>{paroquia.whatsapp}</a>
                : <span style={{ color: '#bbb' }}>Não informado</span>
            }</p>
            <div style={{ marginTop: '8px' }}>
              <strong style={{ color: '#2563eb' }}>Redes sociais:</strong>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                {paroquia?.instagram ? <a href={paroquia.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 700 }}>Instagram</a> : <span style={{ color: '#bbb' }}>Instagram</span>}
                {paroquia?.facebook ? <a href={paroquia.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 700 }}>Facebook</a> : <span style={{ color: '#bbb' }}>Facebook</span>}
              </div>
            </div>
          </div>
        </div>
        {/* Horários */}
        <div style={{ marginBottom: '32px' }}>
          <strong className="block mb-2 text-blue-700 text-xl" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '1.18rem', fontWeight: 900 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" stroke="#fbbf24" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
            Horários
          </strong>
          {horarios.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {horarios.map(h => (
                <li key={h.id} style={{ background: '#f8fafc', borderRadius: '10px', marginBottom: '10px', padding: '12px 20px', fontSize: '1.12rem', border: '1.5px solid #e0e7ff', boxShadow: '0 2px 8px rgba(124,58,237,0.07)' }}>
                  <strong style={{ color: '#2563eb' }}>{h.diaSemana || h.dia_semana}</strong> - {h.hora || h.hora} <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>{h.tipo || h.tipo}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#bbb' }}>Nenhum horário cadastrado.</p>
          )}
        </div>
        {/* Eventos */}
        <div style={{ marginBottom: '22px' }}>
          <strong className="block mb-2 text-blue-700 text-xl" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontSize: '1.18rem', fontWeight: 900 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }}><rect x="3" y="5" width="18" height="16" rx="2" stroke="#7c3aed" strokeWidth="2"/><path d="M16 3v4M8 3v4" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/></svg>
            Eventos
          </strong>
          {eventos.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {eventos.map(e => (
                <li key={e.id} style={{ background: '#f9f5ff', borderRadius: '10px', marginBottom: '14px', padding: '14px 22px', fontSize: '1.12rem', boxShadow: '0 2px 8px rgba(124,58,237,0.07)', border: '1.5px solid #e0e7ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {(e.imagem || e.imagem_evento) ? (
                      <img src={e.imagem || e.imagem_evento} alt={e.titulo || e.titulo_evento} style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #fbbf24' }} />
                    ) : (
                      <img src={logo} alt="Imagem padrão igreja" style={{ width: '54px', height: '54px', objectFit: 'contain', borderRadius: '10px', background: '#e0e7ef', border: '2px solid #fbbf24' }} />
                    )}
                    <div>
                      <strong style={{ fontSize: '1.13rem', color: '#7c3aed', fontWeight: 900 }}>{e.titulo || e.titulo_evento || 'Evento'}</strong>
                      <div style={{ fontSize: '1.01rem', color: '#2563eb', fontWeight: 700 }}>{(e.data || e.data_evento) ? `${e.data || e.data_evento} às ${(e.hora || e.hora_evento)}` : 'Data não informada'}</div>
                      {(e.descricao || e.descricao_evento) ? <div style={{ marginTop: '4px', color: '#334155' }}>{e.descricao || e.descricao_evento}</div> : <div style={{ marginTop: '4px', color: '#bbb' }}>Sem descrição</div>}
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
