'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Church, Calendar, Users, Heart, 
  ChevronDown, ChevronUp, ArrowRight, ShieldCheck 
} from 'lucide-react';
import '@/styles/Landing.css';
import '@/styles/colors.css';
import Footer from '@/components/Footer';

export default function Landing() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Como funciona o Paróquia Perto?',
      a: 'Utilizamos a sua localização para apresentar as paróquias e comunidades mais próximas de si. Pode consultar horários de missas, confissões e eventos em tempo real.',
    },
    {
      q: 'Preciso de criar uma conta?',
      a: 'Não. Pode explorar todas as paróquias e horários livremente. A conta é necessária apenas se desejar marcar eventos como favoritos ou receber notificações da sua comunidade.',
    },
    {
      q: 'É realmente gratuito?',
      a: 'Sim, o Paróquia Perto é um projeto comunitário 100% gratuito. Não existem taxas nem publicidade.',
    },
    {
      q: 'Como posso adicionar a minha paróquia?',
      a: 'Se é pároco ou colaborador, utilize o nosso formulário de contacto. A nossa equipa validará os dados e adicionará a sua comunidade em menos de 24 horas.',
    },
  ];

  return (
    <div className="landing-page">
      {/* Header Premium */}
      <header className="landing-header">
        <div className="landing-container">
          <Link href="/" className="landing-logo">
            <div className="landing-logo-icon">
              <Image src="/logo_paroquia.png" alt="Paróquia Perto Logo" width={38} height={38} priority />
            </div>
            <span className="landing-logo-text">Paróquia Perto</span>
          </Link>
          
          <nav className="landing-nav">
            <Link href="#como-funciona" className="nav-link">Como Funciona</Link>
            <Link href="#recursos" className="nav-link">Recursos</Link>
            <Link href="#faq" className="nav-link">FAQ</Link>
            
            <div className="landing-nav-auth">
              <Link href="/login" className="landing-btn-secondary">
                Entrar
              </Link>
              <Link href="/register" className="landing-btn-primary">
                Começar
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section com Glassmorphism */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="landing-hero-content">
            <h1 className="landing-hero-title">
              Encontre a sua <br /> 
              <span>Comunidade Católica</span>
            </h1>
            <p className="landing-hero-subtitle">
              A tecnologia ao serviço da fé. Localize paróquias, consulte horários de missas e conecte-se com a vida cristã perto de si.
            </p>
            <div className="landing-hero-ctas">
              <button
                className="landing-btn-primary landing-btn-large"
                onClick={() => router.push('/buscar')}
              >
                Procurar Paróquia <ArrowRight size={20} />
              </button>
              <Link href="#como-funciona" className="landing-btn-tertiary landing-btn-large">
                Saiba mais
              </Link>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="landing-hero-card">
              <div className="card-icon-bg"><Church size={32} /></div>
              <p><strong>500+</strong> Paróquias</p>
            </div>
            <div className="landing-hero-card">
              <div className="card-icon-bg"><Users size={32} /></div>
              <p><strong>Comunidade</strong> Ativa</p>
            </div>
            <div className="landing-hero-card">
              <div className="card-icon-bg"><ShieldCheck size={32} /></div>
              <p>Dados <strong>Verificados</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Passos Dinâmicos */}
      <section id="como-funciona" className="landing-section landing-how-it-works">
        <div className="landing-container">
          <h2>Como Funciona</h2>
          <p className="landing-section-subtitle">Simplicidade para focar no que realmente importa: a sua fé.</p>

          <div className="landing-steps">
            {[
              { n: 1, t: 'Localize', d: 'Dê permissão de localização ou pesquise por concelho e freguesia.' },
              { n: 2, t: 'Escolha', d: 'Compare horários de missas e confissões das igrejas mais próximas.' },
              { n: 3, t: 'Participe', d: 'Marque presença em eventos, grupos de oração e atividades pastorais.' }
            ].map((step) => (
              <div key={step.n} className="landing-step">
                <div className="landing-step-number">{step.n}</div>
                <h3>{step.t}</h3>
                <p>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Estilo Impactante */}
      <section className="landing-section landing-stats">
        <div className="landing-container">
          <div className="landing-stats-grid">
            <div className="landing-stat">
              <div className="landing-stat-number">500+</div>
              <p>Paróquias Integradas</p>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-number">10K+</div>
              <p>Católicos Conectados</p>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-number">100%</div>
              <p>Seguro e Gratuito</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ com Animação */}
      <section id="faq" className="landing-section landing-faq">
        <div className="landing-container">
          <h2>Perguntas Frequentes</h2>
          <div className="landing-faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`landing-faq-item ${expandedFaq === idx ? 'active' : ''}`}>
                <button
                  className="landing-faq-question"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  aria-expanded={expandedFaq === idx}
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div className={`landing-faq-answer ${expandedFaq === idx ? 'show' : ''}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
