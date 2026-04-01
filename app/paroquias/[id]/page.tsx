'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Facebook, Instagram, MessageCircle, 
  Phone, MapPinned, Clock, Info, Calendar, 
  ChevronLeft, Mail
} from 'lucide-react';
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
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    params.then((p) => setId(p.id));
    return () => window.removeEventListener('resize', checkMobile);
  }, [params]);

  React.useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [resP, resH, resE] = await Promise.all([
          fetch(`/api/paroquias/${id}`),
          fetch('/api/horarios'),
          fetch('/api/eventos')
        ]);
        const paroquiaData = await resP.json();
        const horariosData = await resH.json();
        const eventosData = await resE.json();

        setParoquia(paroquiaData);
        setHorarios(Array.isArray(horariosData) ? horariosData.filter((h: any) => h.paroquiaId === Number(id)) : []);
        setEventos(Array.isArray(eventosData) ? eventosData.filter((e: any) => e.paroquiaId === Number(id)) : []);
      } catch (err) {
        console.error("Erro ao carregar dados", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // LÓGICA DE AGRUPAMENTO DE HORÁRIOS
  const horariosAgrupados = React.useMemo(() => {
    return horarios.reduce((acc: { [key: string]: Horario[] }, curr) => {
      const dia = curr.diaSemana;
      if (!acc[dia]) acc[dia] = [];
      acc[dia].push(curr);
      return acc;
    }, {});
  }, [horarios]);

  const abrirDirecoes = () => {
    if (!paroquia) return;
    const moradaTexto = `${paroquia.rua}, ${paroquia.numeroPorta || ''} ${paroquia.codigoPostal} ${paroquia.localidade}`;
    const query = (paroquia.lat && paroquia.lng) 
      ? `${paroquia.lat},${paroquia.lng}` 
      : encodeURIComponent(moradaTexto);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--detalhe-bg)' }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTopColor: '#243B55', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="paroquia-detalhe-bg" style={{ paddingBottom: '80px' }}>
        
        <div style={{ position: 'relative', width: '100%', height: isMobile ? '220px' : '380px', overflow: 'hidden' }}>
          <img 
            src={paroquia?.imagem || "/logo_paroquia.png"} 
            alt={paroquia?.nome} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))' }}></div>
          <button onClick={() => router.back()} className="back-button-overlay">
            <ChevronLeft size={18} /> Voltar
          </button>
        </div>

        <div className="paroquia-detalhe-card" style={{ 
          position: 'relative', 
          zIndex: 2, 
          marginTop: '-60px', 
          padding: isMobile ? '24px' : '48px', 
          maxWidth: '1100px', 
          margin: '0 auto' 
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <h1 className="paroquia-detalhe-title">{paroquia?.nome}</h1>
              <p onClick={abrirDirecoes} className="address-link">
                <MapPinned size={18} /> 
                {paroquia && (
                `${paroquia?.rua}${paroquia?.numeroPorta ? `, ${paroquia.numeroPorta}` : ''} - ${paroquia?.codigoPostal} ${paroquia?.localidade}`
                )}
              </p>
            </div>
            <button onClick={abrirDirecoes} className="cta-button-gradient">
              <MapPinned size={20} /> Como Chegar
            </button>
          </div>

          <div className="paroquia-detalhe-grid">
            <div className="main-content-column">
              <section className="info-group">
                <h3 className="section-title"><Info size={20} color="var(--color-gold)" /> Sobre a Paróquia</h3>
                <p className="description-text">{paroquia?.descricao || "Esta paróquia ainda não tem uma descrição detalhada disponível."}</p>
              </section>

              {/* SEÇÃO DE HORÁRIOS AGRUPADOS */}
              <section style={{ marginTop: '40px' }}>
                <h3 className="section-title"><Clock size={20} color="var(--color-gold)" /> Horários de Missa</h3>
                <div className="horarios-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {Object.keys(horariosAgrupados).length > 0 ? (
                    Object.entries(horariosAgrupados).map(([dia, lista]) => (
                      <div key={dia} className="horario-card-agrupado" style={{
                        background: 'var(--card-bg)',
                        padding: '24px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                      }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 800, 
                          color: 'var(--color-gold)', 
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          display: 'block',
                          marginBottom: '15px',
                          borderBottom: '1px solid var(--border-color)',
                          paddingBottom: '8px'
                        }}>
                          {dia}
                        </span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {lista.map((h) => (
                            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>
                                {h.hora}
                              </div>
                              <div style={{ 
                                fontSize: '0.8rem', 
                                color: 'var(--text-sub)', 
                                background: 'rgba(166, 124, 82, 0.1)', 
                                padding: '4px 10px', 
                                borderRadius: '8px' 
                              }}>
                                {h.tipo}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-sub)' }}>Nenhum horário registado no momento.</p>
                  )}
                </div>
              </section>
            </div>

            <div className="sidebar-column">
              <div className="contacts-card">
                <h4 className="sidebar-title">Contactos</h4>
                <div className="contacts-list">
                  {paroquia?.telefone && (
                    <a href={`tel:${paroquia.telefone}`} className="contact-link">
                      <div className="icon-box"><Phone size={18} /></div>
                      <span>{paroquia.telefone}</span>
                    </a>
                  )}
                  {paroquia?.email && (
                    <a href={`mailto:${paroquia.email}`} className="contact-link">
                      <div className="icon-box"><Mail size={18} /></div>
                      <span style={{ wordBreak: 'break-all' }}>{paroquia.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
