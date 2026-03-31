'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Facebook, Instagram, MessageCircle, 
  Phone, MapPinned, Clock, Info, Calendar, 
  ChevronLeft, Globe, Mail, Share2
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

  React.useEffect(() => {
    params.then((p) => setId(p.id));
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
        // Filtragem segura
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
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTopColor: '#243B55', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="paroquia-detalhe-bg" style={{ paddingBottom: '80px' }}>
        
        {/* Banner de Topo (Hero) */}
        <div style={{ position: 'relative', width: '100%', height: '350px', marginBottom: '-60px' }}>
          <img 
            src={paroquia?.imagem || "/logo_paroquia.png"} 
            alt={paroquia?.nome} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))' }}></div>
          <button 
            onClick={() => router.back()} 
            style={{ position: 'absolute', top: '24px', left: '24px', background: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
          >
            <ChevronLeft size={18} /> Voltar
          </button>
        </div>

        <div className="paroquia-detalhe-card" style={{ position: 'relative', zIndex: 2, background: '#fff', borderRadius: '32px', padding: isMobile ? '24px' : '48px', maxWidth: '1100px', margin: '0 auto', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#243B55', margin: 0 }}>{paroquia?.nome}</h1>
              <p onClick={abrirDirecoes} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '1.1rem', marginTop: '8px', cursor: 'pointer' }}>
                <MapPinned size={18} /> {paroquia?.endereco}
              </p>
            </div>
            <button onClick={abrirDirecoes} style={{ background: 'linear-gradient(135deg, #243B55, #3E5C76)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              Como Chegar
            </button>
          </div>

          <div className="paroquia-detalhe-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            
            {/* Coluna Principal */}
            <div>
              <section className="info-group">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#243B55', fontSize: '1.4rem' }}>
                  <Info size={20} color="#A67C52" /> Sobre a Paróquia
                </h3>
                <p style={{ lineHeight: '1.8', color: '#475569', fontSize: '1.05rem', background: '#f8fafc', padding: '24px', borderRadius: '16px', borderLeft: '5px solid #A67C52' }}>
                  {paroquia?.descricao || "Esta paróquia ainda não tem uma descrição detalhada."}
                </p>
              </section>

              {/* Horários Otimizados */}
              <section style={{ marginTop: '40px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#243B55', fontSize: '1.4rem', marginBottom: '20px' }}>
                  <Clock size={20} color="#A67C52" /> Horários de Missa e Serviços
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {horarios.length > 0 ? horarios.map((h) => (
                    <div key={h.id} style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <span style={{ fontWeight: 800, color: '#A67C52', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h.diaSemana}</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#243B55', marginTop: '4px' }}>{h.hora}</div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{h.tipo}</div>
                    </div>
                  )) : <p>Nenhum horário registado.</p>}
                </div>
              </section>
            </div>

            {/* Coluna Lateral */}
            <div>
              <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 24px 0', color: '#243B55' }}>Contactos</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {paroquia?.telefone && (
                    <a href={`tel:${paroquia.telefone}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#475569', fontWeight: 600 }}>
                      <div style={{ background: '#fff', p: 8, borderRadius: 10, border: '1px solid #e2e8f0' }}><Phone size={18} /></div>
                      {paroquia.telefone}
                    </a>
                  )}
                  {paroquia?.email && (
                    <a href={`mailto:${paroquia.email}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#475569', fontWeight: 600 }}>
                      <div style={{ background: '#fff', p: 8, borderRadius: 10, border: '1px solid #e2e8f0' }}><Mail size={18} /></div>
                      {paroquia.email}
                    </a>
                  )}
                  {paroquia?.site && (
                    <a href={paroquia.site} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#475569', fontWeight: 600 }}>
                      <div style={{ background: '#fff', p: 8, borderRadius: 10, border: '1px solid #e2e8f0' }}><Globe size={18} /></div>
                      Site Oficial
                    </a>
                  )}
                </div>

                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>Redes Sociais</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {paroquia?.facebook && <a href={paroquia.facebook} target="_blank" className="social-icon-btn"><Facebook size={22} /></a>}
                    {paroquia?.instagram && <a href={paroquia.instagram} target="_blank" className="social-icon-btn"><Instagram size={22} /></a>}
                    {paroquia?.whatsapp && <a href={`https://wa.me/${paroquia.whatsapp.replace(/\D/g,'')}`} target="_blank" className="social-icon-btn"><MessageCircle size={22} /></a>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Eventos */}
          {eventos.length > 0 && (
            <section style={{ marginTop: '60px', borderTop: '1px solid #e2e8f0', paddingTop: '40px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#243B55', fontSize: '1.4rem', marginBottom: '30px' }}>
                <Calendar size={20} color="#A67C52" /> Próximos Eventos
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {eventos.map((e) => (
                  <div key={e.id} className="evento-item-card" style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={e.imagem || "/logo_paroquia.png"} style={{ width: '100%', height: '160px', objectFit: 'cover' }} alt={e.titulo} />
                    <div style={{ padding: '20px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#243B55', fontSize: '1.1rem' }}>{e.titulo}</h4>
                      <div style={{ fontSize: '0.9rem', color: '#A67C52', fontWeight: 800 }}>{e.data} · {e.hora}</div>
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
