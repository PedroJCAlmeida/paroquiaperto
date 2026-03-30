'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Facebook, Instagram, MessageCircle, 
  Phone, MapPinned, Clock, Info, Calendar 
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
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    setToken(localStorage.getItem('token'));
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
        setHorarios(horariosData.filter((h: any) => h.paroquia?.id === Number(id)));
        setEventos(eventosData.filter((e: any) => e.paroquia?.id === Number(id)));
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

  if (loading) return <div className="loading-state">A carregar...</div>;

  return (
    <>
      <Navbar />
      <div className="paroquia-detalhe-bg">
        <div className="paroquia-detalhe-card">
          
          <button onClick={() => window.history.back()} className="landing-btn-secondary" style={{ marginBottom: '24px' }}>
            ← Voltar
          </button>

          <h2 className="paroquia-detalhe-title">{paroquia?.nome}</h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <img 
              src={paroquia?.imagem || "/logo_paroquia.png"} 
              alt={paroquia?.nome} 
              style={{ width: '100%', borderRadius: '12px', maxHeight: '400px', objectFit: 'cover' }} 
            />
          </div>

          <div className="paroquia-detalhe-grid">
            {/* Coluna 1: Info e Descrição */}
            <div>
              <div className="info-group">
                <label><Info size={14} style={{verticalAlign: 'middle', marginRight: '4px'}}/> Descrição</label>
                <p>{paroquia?.descricao || "Sem descrição disponível."}</p>
              </div>

              <div className="info-group">
                <label><MapPinned size={14} style={{verticalAlign: 'middle', marginRight: '4px'}}/> Endereço</label>
                <p 
                  onClick={abrirDirecoes} 
                  style={{ cursor: 'pointer', color: 'var(--color-blue)', fontWeight: 'bold' }}
                >
                  {paroquia?.endereco}
                </p>
              </div>
            </div>

            {/* Coluna 2: Contactos e Redes */}
            <div>
              <div className="info-group">
                <label><Phone size={14} style={{verticalAlign: 'middle', marginRight: '4px'}}/> Contacto</label>
                <p>
                  {paroquia?.telefone ? (
                    <a href={`tel:${paroquia.telefone.replace(/\D/g, '')}`} style={{textDecoration: 'none', color: 'inherit'}}>
                      {paroquia.telefone}
                    </a>
                  ) : "Não informado"}
                </p>
              </div>

              <div className="info-group">
                <label>Redes Sociais</label>
                <div className="social-icons-wrapper">
                  {paroquia?.facebook && (
                    <a href={paroquia.facebook} target="_blank" className="social-icon-btn"><Facebook size={20} /></a>
                  )}
                  {paroquia?.instagram && (
                    <a href={paroquia.instagram} target="_blank" className="social-icon-btn"><Instagram size={20} /></a>
                  )}
                  {paroquia?.whatsapp && (
                    <a href={`https://wa.me/${paroquia.whatsapp.replace(/\D/g, '')}`} target="_blank" className="social-icon-btn"><MessageCircle size={20} /></a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Horários */}
          <div style={{ marginTop: '40px', borderTop: '1px solid var(--color-gray-200)', paddingTop: '30px' }}>
             <h3 style={{ color: 'var(--color-blue)', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} /> Horários
             </h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                {horarios.map((h) => (
                  <div key={h.id} style={{ background: 'var(--color-gray-50)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-gray-200)' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-gray-800)' }}>{h.diaSemana}</div>
                    <div style={{ color: 'var(--color-blue)', fontSize: '1.1rem' }}>{h.hora} <span style={{fontSize: '0.8rem', opacity: 0.7}}>{h.tipo}</span></div>
                  </div>
                ))}
             </div>
          </div>

          {/* Eventos usando as classes do teu CSS */}
          <div style={{ marginTop: '40px', borderTop: '1px solid var(--color-gray-200)', paddingTop: '30px' }}>
             <h3 style={{ color: 'var(--color-blue)', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} /> Próximos Eventos
             </h3>
             <div style={{ display: 'grid', gap: '16px' }}>
                {eventos.map((e) => (
                  <div key={e.id} className="evento-item-card">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div className="evento-img-wrapper">
                        <img src={e.imagem || "/logo_paroquia.png"} alt={e.titulo} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, color: 'var(--color-blue)', fontWeight: 800 }}>{e.titulo}</h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                          {e.data} · {e.hora}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}