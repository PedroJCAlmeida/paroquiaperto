'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Facebook, Instagram, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/ParoquiaDetalhe.css';
import type { Paroquia, Horario, Evento } from '@/types';

export default function ParoquiaDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = React.useState<string | null>(null);
  const [paroquia, setParoquia] = React.useState<Paroquia | null>(null);
  const [horarios, setHorarios] = React.useState<Horario[]>([]);
  const [eventos, setEventos] = React.useState<Evento[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
  }, []);

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

  const handleCriarEvento = () => {
    const path = `/backoffice/eventos`;
    token ? router.push(path) : router.push(`/register?redirect=${path}`);
  };

  const handleCriarHorario = () => {
    const path = `/backoffice/horarios`;
    token ? router.push(path) : router.push(`/register?redirect=${path}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '64px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="24" cy="24" r="20" stroke="var(--color-blue)" strokeWidth="6" strokeDasharray="31 31" />
            </svg>
            <div style={{ marginTop: '16px', color: 'var(--color-blue)', fontWeight: 'bold' }}>Carregando dados...</div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '64px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ef4444', fontWeight: 'bold' }}>Erro: {error}</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="paroquia-detalhe-bg">
        <div className="paroquia-detalhe-card">
          <button onClick={() => window.history.back()} className="landing-btn-secondary" style={{ marginBottom: '24px' }}>
            ← Voltar para lista
          </button>

          <h2 className="paroquia-detalhe-title" style={{ textAlign: 'center' }}>
            {paroquia?.nome}
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <img 
              src={paroquia?.imagem || "/logo_paroquia.png"} 
              alt={paroquia?.nome || "Paróquia"} 
              style={{ maxWidth: '100%', borderRadius: '12px', maxHeight: '300px', border: '3px solid var(--color-gold)' }} 
            />
          </div>

          <div className="paroquia-detalhe-grid">
            <div>
              <div className="info-group">
                <label>Endereço</label>
                <p>
                  {paroquia?.endereco ? (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(paroquia.endereco)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-blue)', fontWeight: 700 }}>
                      {paroquia.endereco}
                    </a>
                  ) : "Não informado"}
                </p>
              </div>
              <div className="info-group">
                <label>Descrição</label>
                <p>{paroquia?.descricao || "Sem descrição disponível."}</p>
              </div>
            </div>

            <div>
              <div className="info-group">
                <label>Contacto</label>
                <p>{paroquia?.telefone || "Não informado"}</p>
                <p>{paroquia?.email || ""}</p>
              </div>

              {(paroquia?.facebook || paroquia?.instagram || paroquia?.whatsapp) && (
                <div className="info-group">
                  <label>Redes Sociais</label>
                  <div className="social-icons-wrapper">
                    {paroquia?.facebook && (
                      <a href={paroquia.facebook} target="_blank" rel="noopener noreferrer" className="social-icon-btn facebook" title="Facebook">
                        <Facebook size={20} />
                      </a>
                    )}
                    {paroquia?.instagram && (
                      <a href={paroquia.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" title="Instagram">
                        <Instagram size={20} />
                      </a>
                    )}
                    {paroquia?.whatsapp && (
                      <a href={`https://wa.me/${paroquia.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="social-icon-btn whatsapp" title="WhatsApp">
                        <MessageCircle size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Secção de Horários */}
          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--color-gray-100)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: 'var(--color-blue)', fontWeight: 900, margin: 0 }}>Horários</h3>
                <button onClick={handleCriarHorario} className="landing-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>+ Horário</button>
             </div>
             {horarios.length > 0 ? (
               <ul style={{ listStyle: 'none', padding: 0 }}>
                 {horarios.map((h) => (
                   <li key={h.id} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                     <strong>{h.diaSemana}</strong>: {h.hora} - <span style={{ color: 'var(--color-blue)' }}>{h.tipo}</span>
                   </li>
                 ))}
               </ul>
             ) : <p style={{ color: 'var(--color-gray-400)' }}>Sem horários registados.</p>}
          </div>

          {/* Secção de Eventos */}
          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--color-gray-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--color-blue)', fontWeight: 900, margin: 0 }}>Próximos Eventos</h3>
              <button onClick={handleCriarEvento} className="landing-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <Plus size={16} /> Criar Evento
              </button>
            </div>

            {eventos.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {eventos.map((e) => (
                  <div key={e.id} className="evento-item-card">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div className="evento-img-wrapper">
                        <img src={e.imagem || "/logo_paroquia.png"} alt={e.titulo} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-blue)', fontSize: '1.1rem', fontWeight: 800 }}>{e.titulo}</h4>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                          <span>📅 {e.data}</span>
                          <span>⏰ {e.hora}</span>
                        </div>
                        {e.descricao && <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: 'var(--color-gray-600)' }}>{e.descricao}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-gray-400)', textAlign: 'center' }}>Não existem eventos agendados.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
