'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Facebook, Instagram, MessageCircle, 
  Phone, MapPinned, Clock, Info, Calendar, 
  ChevronLeft, Globe, Mail
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
    // Lógica para detetar mobile e evitar erro de 'window' no build
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

  const abrirDirecoes = () => {
    if (!paroquia) return;
    const query = (paroquia.lat && paroquia.lng) 
      ? `${paroquia.lat},${paroquia.lng}` 
      : encodeURIComponent(paroquia.endereco);
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
        
        <div style={{ position: 'relative', width: '100%', height: isMobile ? '250px' : '350px', marginBottom: '-60px' }}>
          <img 
            src={paroquia?.imagem || "/logo_paroquia.png"} 
            alt={paroquia?.nome} 
            className="paroquia-hero-img"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))' }}></div>
          <button 
            onClick={() => router.back()} 
            className="back-button-overlay"
          >
            <ChevronLeft size={18} /> Voltar
          </button>
        </div>

        <div className="paroquia-detalhe-card" style={{ 
          position: 'relative', 
          zIndex: 2, 
          padding: isMobile ? '24px' : '48px', 
          maxWidth: '1100px', 
          margin: '0 auto' 
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <h1 className="paroquia-detalhe-title">{paroquia?.nome}</h1>
              <p onClick={abrirDirecoes} className="address-link">
                <MapPinned size={18} /> {paroquia?.endereco}
              </p>
            </div>
            <button onClick={abrirDirecoes} className="cta-button-gradient">
              Como Chegar
            </button>
          </div>

          <div className="paroquia-detalhe-grid">
            
            <div className="main-content-column">
              <section className="info-group">
                <h3 className="section-title">
                  <Info size={20} color="var(--color-gold)" /> Sobre a Paróquia
                </h3>
                <p className="description-text">
                  {paroquia?.descricao || "Esta paróquia ainda não tem uma descrição detalhada."}
                </p>
              </section>

              <section style={{ marginTop: '40px' }}>
                <h3 className="section-title">
                  <Clock size={20} color="var(--color-gold)" /> Horários
                </h3>
                <div className="horarios-grid">
                  {horarios.length > 0 ? horarios.map((h) => (
                    <div key={h.id} className="horario-card">
                      <span className="day-label">{h.diaSemana}</span>
                      <div className="time-value">{h.hora}</div>
                      <div className="type-label">{h.tipo}</div>
                    </div>
                  )) : <p>Nenhum horário registado.</p>}
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
                      {paroquia.telefone}
                    </a>
                  )}
                  {paroquia?.email && (
                    <a href={`mailto:${paroquia.email}`} className="contact-link">
                      <div className="icon-box"><Mail size={18} /></div>
                      {paroquia.email}
                    </a>
                  )}
                </div>

                <div className="social-divider">
                  <p className="social-label">Redes Sociais</p>
                  <div className="social-icons-wrapper">
                    {paroquia?.facebook && <a href={paroquia.facebook} target="_blank" className="social-icon-btn"><Facebook size={22} /></a>}
                    {paroquia?.instagram && <a href={paroquia.instagram} target="_blank" className="social-icon-btn"><Instagram size={22} /></a>}
                    {paroquia?.whatsapp && <a href={`https://wa.me/${paroquia.whatsapp.replace(/\D/g,'')}`} target="_blank" className="social-icon-btn"><MessageCircle size={22} /></a>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {eventos.length > 0 && (
            <section className="events-section">
              <h3 className="section-title">
                <Calendar size={20} color="var(--color-gold)" /> Próximos Eventos
              </h3>
              <div className="events-grid">
                {eventos.map((e) => (
                  <div key={e.id} className="evento-item-card">
                    <img src={e.imagem || "/logo_paroquia.png"} alt={e.titulo} className="event-img" />
                    <div className="event-info">
                      <h4>{e.titulo}</h4>
                      <div className="event-meta">{e.data} · {e.hora}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
