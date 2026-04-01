'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Church, Calendar, Users, Heart, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import '@/styles/Landing.css';
import '@/styles/colors.css';
import Footer from '@/components/Footer';

export default function Landing() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      q: 'Como funciona o Paróquia Perto?',
      a: 'Utilize a sua localização para encontrar paróquias próximas, consulte horários de missas, eventos e conecte-se com sua comunidade católica local.',
    },
    {
      q: 'Preciso criar uma conta?',
      a: 'Pode explorar paróquias e horários sem criar conta. Para aceder a funcionalidades avançadas e participar em eventos, recomendamos criar uma conta gratuita.',
    },
    {
      q: 'É gratuito?',
      a: 'Sim, o Paróquia Perto é completamente gratuito. Queremos facilitar o acesso à vida paroquial para todos.',
    },
    {
      q: 'Como adiciono minha paróquia?',
      a: 'Se é representante de uma paróquia, entre em contacto connosco através da página de contacto para adicionar ou atualizar informações.',
    },
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-container">
          <Link href="/" className="landing-logo">
            <span className="landing-logo-icon">
              <Image 
                src="/logo_paroquia.png" 
                alt="Logo Paróquia Perto" 
                width={40} 
                height={40} 
                className="landing-logo-image" 
                priority 
              />
            </span>
            Paróquia Perto
          </Link>
          <nav className="landing-nav">
            <Link href="#como-funciona">Como Funciona</Link>
            <Link href="#recursos">Recursos</Link>
            <Link href="#faq">FAQ</Link>
            <div className="landing-nav-auth">
              <Link href="/login" className="landing-btn-secondary">
                Entrar
              </Link>
              <Link href="/register" className="landing-btn-primary">
                Registar
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="landing-hero-content">
            <h1 className="landing-hero-title">
              Encontre Sua Comunidade Católica
            </h1>
            <p className="landing-hero-subtitle">
              Descubra a paróquia mais próxima, consulte horários de missas, fique a par dos eventos e conecte-se com sua fé.
            </p>
            <div className="landing-hero-ctas">
              <button
                className="landing-btn-primary landing-btn-large"
                onClick={() => router.push('/buscar')}
              >
                Começar Agora <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </button>
              <Link href="#como-funciona" className="landing-btn-tertiary landing-btn-large">
                Saber Mais
              </Link>
            </div>
          </div>
          <div className="landing-hero-visual">
            <div className="landing-hero-card">
              <Church size={48} className="landing-hero-icon" />
              <p><strong>500+</strong> Paróquias</p>
            </div>
            <div className="landing-hero-card">
              <Users size={48} className="landing-hero-icon" />
              <p><strong>Comunidade</strong> Ativa</p>
            </div>
            <div className="landing-hero-card">
              <Calendar size={48} className="landing-hero-icon" />
              <p><strong>Eventos</strong> Semanais</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="landing-section landing-how-it-works">
        <div className="landing-container">
          <h2>Como Funciona</h2>
          <p className="landing-section-subtitle">Aproximando a tecnologia da sua vida espiritual</p>

          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3>Localize</h3>
              <p>Permita o acesso à sua localização ou pesquise por morada para encontrar igrejas próximas.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <h3>Explore</h3>
              <p>Consulte horários de missas, confissões, contactos e atividades pastorais em tempo real.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <h3>Conecte</h3>
              <p>Participe na vida comunitária e receba atualizações sobre os eventos da sua paróquia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="landing-section landing-features">
        <div className="landing-container">
          <h2>Recursos Principais</h2>
          <p className="landing-section-subtitle">Tudo o que precisa num só lugar</p>

          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon"><MapPin size={32} /></div>
              <h3>Geolocalização</h3>
              <p>Encontre o caminho mais rápido para qualquer igreja com integração de mapas.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Calendar size={32} /></div>
              <h3>Agenda Litúrgica</h3>
              <p>Horários atualizados de celebrações e festividades religiosas.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Heart size={32} /></div>
              <h3>Grupos e Movimentos</h3>
              <p>Descubra onde pode servir e crescer na sua caminhada cristã.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Users size={32} /></div>
              <h3>Rede Comunitária</h3>
              <p>Um espaço dedicado à partilha e união entre paroquianos.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Church size={32} /></div>
              <h3>Ficha de Paróquia</h3>
              <p>História, contactos diretos, redes sociais e galeria de fotos.</p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Heart size={32} /></div>
              <h3>Sem Custos</h3>
              <p>Um serviço gratuito mantido para fortalecer a Igreja em Portugal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-section landing-stats">
        <div className="landing-container">
          <div className="landing-stats-grid">
            <div className="landing-stat">
              <div className="landing-stat-number">500+</div>
              <p>Paróquias</p>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-number">10K+</div>
              <p>Utilizadores</p>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-number">2K+</div>
              <p>Eventos/Mês</p>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-number">100%</div>
              <p>Gratuito</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section landing-cta-section">
        <div className="landing-container">
          <h2>Pronto para Conectar-se?</h2>
          <p>Junte-se a milhares de católicos e viva a paróquia de uma forma nova.</p>
          <div className="landing-cta-buttons">
            <button
              className="landing-btn-primary landing-btn-large"
              onClick={() => router.push('/register')}
            >
              Criar Conta Gratuita
            </button>
            <button
              className="landing-btn-secondary landing-btn-large"
              onClick={() => router.push('/buscar')}
            >
              Explorar como Convidado
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="landing-section landing-faq">
        <div className="landing-container">
          <h2>Perguntas Frequentes</h2>
          <div className="landing-faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`landing-faq-item ${expandedFaq === idx ? 'active' : ''}`}>
                <button
                  className="landing-faq-question"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
                {expandedFaq === idx && (
                  <div className="landing-faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
