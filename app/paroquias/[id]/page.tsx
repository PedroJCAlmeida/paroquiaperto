'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import '@/styles/ParoquiaDetalhe.css';
import type { Paroquia, Horario, Evento } from '@/types';

export default function ParoquiaDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = React.useState<string | null>(null);
  const [paroquia, setParoquia] = React.useState<Paroquia | null>(null);
  const [horarios, setHorarios] = React.useState<Horario[]>([]);
  const [eventos, setEventos] = React.useState<Evento[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Unwrap params Promise (Next.js 15)
  React.useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  React.useEffect(() => {
    if (!id) return;

    const safeJson = async <T,>(res: Response): Promise<T[]> => {
      if (!res.ok) return [];
      try {
        return (await res.json()) as T[];
      } catch {
        return [];
      }
    };

    Promise.all([
      fetch(`/api/paroquias/${id}`).then((res) => {
        if (!res.ok) throw new Error('Paróquia não encontrada');
        return res.json() as Promise<Paroquia>;
      }),
      fetch('/api/horarios').then((res) => safeJson<Horario>(res)),
      fetch('/api/eventos').then((res) => safeJson<Evento>(res)),
    ])
      .then(([paroquiaData, horariosData, eventosData]) => {
        setParoquia(paroquiaData);
        setHorarios(horariosData.filter((h) => h.paroquia && String(h.paroquia.id) === String(id)));
        setEventos(eventosData.filter((e) => e.paroquia && String(e.paroquia.id) === String(id)));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '64px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="24" cy="24" r="20" stroke="#2563eb" strokeWidth="6" strokeDasharray="31 31" />
            </svg>
            <div style={{ marginTop: '16px', color: '#2563eb', fontWeight: 'bold' }}>Carregando dados...</div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '64px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginTop: '16px', color: '#ef4444', fontWeight: 'bold' }}>Erro: {error}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="paroquia-detalhe-bg">
        <div className="paroquia-detalhe-card">
          <button
            onClick={() => window.history.back()}
            style={{ outline: 'none', border: 'none', marginBottom: '22px', padding: '12px 28px', fontWeight: 900, fontSize: '1.08rem', borderRadius: '12px', background: 'linear-gradient(90deg,#2563eb 0%,#7c3aed 100%)', color: '#fff', cursor: 'pointer' }}
          >
            ← Voltar para lista
          </button>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 900, color: '#2563eb', marginBottom: 18 }}>{paroquia?.nome}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            {paroquia?.imagem ? (
              <img src={paroquia.imagem} alt={paroquia.nome} style={{ maxWidth: '100%', borderRadius: '18px', maxHeight: '260px', border: '2px solid #fbbf24' }} />
            ) : (
              <img src="/logo.png" alt="Imagem padrão" style={{ width: '130px', height: '130px', objectFit: 'contain', borderRadius: '18px', background: '#e0e7ef', border: '2px solid #fbbf24' }} />
            )}
          </div>
          <div className="paroquia-detalhe-grid">
            <div>
              <p>
                <strong style={{ color: '#2563eb' }}>Endereço:</strong>{' '}
                {paroquia?.endereco ? (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(paroquia.endereco)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 700 }}>
                    {paroquia.endereco}
                  </a>
                ) : (
                  <span style={{ color: '#bbb' }}>Não informado</span>
                )}
              </p>
              <p style={{ marginTop: 8 }}><strong style={{ color: '#2563eb' }}>Descrição:</strong> {paroquia?.descricao ?? <span style={{ color: '#bbb' }}>Não informado</span>}</p>
              <p style={{ marginTop: 8 }}>
                <strong style={{ color: '#2563eb' }}>Telefone:</strong>{' '}
                {paroquia?.telefone ? (
                  <a href={`tel:${paroquia.telefone}`} style={{ color: '#fbbf24', fontWeight: 700 }}>{paroquia.telefone}</a>
                ) : (
                  <span style={{ color: '#bbb' }}>Não informado</span>
                )}
              </p>
              <p style={{ marginTop: 8 }}>
                <strong style={{ color: '#2563eb' }}>Email:</strong>{' '}
                {paroquia?.email ? (
                  <a href={`mailto:${paroquia.email}`} style={{ color: '#7c3aed', fontWeight: 700 }}>{paroquia.email}</a>
                ) : (
                  <span style={{ color: '#bbb' }}>Não informado</span>
                )}
              </p>
            </div>
            <div>
              <p>
                <strong style={{ color: '#2563eb' }}>Site:</strong>{' '}
                {paroquia?.site ? (
                  <a href={paroquia.site} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 700 }}>{paroquia.site}</a>
                ) : (
                  <span style={{ color: '#bbb' }}>Não informado</span>
                )}
              </p>
              <p style={{ marginTop: 8 }}>
                <strong style={{ color: '#2563eb' }}>Whatsapp:</strong>{' '}
                {paroquia?.whatsapp ? (
                  <a href={`https://wa.me/${paroquia.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', fontWeight: 700 }}>{paroquia.whatsapp}</a>
                ) : (
                  <span style={{ color: '#bbb' }}>Não informado</span>
                )}
              </p>
              <div style={{ marginTop: '8px' }}>
                <strong style={{ color: '#2563eb' }}>Redes sociais:</strong>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                  {paroquia?.instagram ? (
                    <a href={paroquia.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 700 }}>Instagram</a>
                  ) : (
                    <span style={{ color: '#bbb' }}>Instagram</span>
                  )}
                  {paroquia?.facebook ? (
                    <a href={paroquia.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 700 }}>Facebook</a>
                  ) : (
                    <span style={{ color: '#bbb' }}>Facebook</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <strong style={{ color: '#fbbf24', fontSize: '1.18rem', fontWeight: 900 }}>Horários</strong>
            {horarios.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
                {horarios.map((h) => (
                  <li key={h.id} style={{ background: '#f8fafc', borderRadius: '10px', marginBottom: '10px', padding: '12px 20px', border: '1.5px solid #e0e7ff' }}>
                    <strong style={{ color: '#2563eb' }}>{h.diaSemana}</strong> - {h.hora}{' '}
                    <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>{h.tipo}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#bbb', marginTop: 8 }}>Nenhum horário cadastrado.</p>
            )}
          </div>

          <div style={{ marginBottom: '22px' }}>
            <strong style={{ color: '#7c3aed', fontSize: '1.18rem', fontWeight: 900 }}>Eventos</strong>
            {eventos.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
                {eventos.map((e) => (
                  <li key={e.id} style={{ background: '#f9f5ff', borderRadius: '10px', marginBottom: '14px', padding: '14px 22px', border: '1.5px solid #e0e7ff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {e.imagem ? (
                        <img src={e.imagem} alt={e.titulo} style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #fbbf24' }} />
                      ) : (
                        <img src="/logo.png" alt="Imagem padrão" style={{ width: '54px', height: '54px', objectFit: 'contain', borderRadius: '10px', background: '#e0e7ef', border: '2px solid #fbbf24' }} />
                      )}
                      <div>
                        <strong style={{ fontSize: '1.13rem', color: '#7c3aed', fontWeight: 900 }}>{e.titulo || 'Evento'}</strong>
                        <div style={{ color: '#2563eb', fontWeight: 700 }}>{e.data ? `${e.data} às ${e.hora}` : 'Data não informada'}</div>
                        {e.descricao ? (
                          <div style={{ marginTop: '4px', color: '#334155' }}>{e.descricao}</div>
                        ) : (
                          <div style={{ color: '#bbb' }}>Sem descrição</div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#bbb', marginTop: 8 }}>Nenhum evento cadastrado.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
