'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/Landing.css';
import '@/styles/colors.css';
import Footer from '@/components/Footer';
import { 
  MapPin, 
  Church, 
  Calendar, 
  Users, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  ShieldCheck,
  Menu as MenuIcon,
  X 
} from 'lucide-react';

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
      a: 'Pode explorar paróquias e horários sem conta. A conta é recomendada para participar em eventos e receber atualizações da sua comunidade.',
    },
    {
      q: 'É gratuito?',
      a: 'Sim, o Paróquia Perto é um projeto comunitário completamente gratuito. Queremos facilitar o acesso à vida paroquial para todos.',
    },
    {
      q: 'Como adiciono minha paróquia?',
      a: 'Se é representante de uma paróquia, entre em contacto connosco através da página de contacto para validar e adicionar as suas informações.',
    },
  ];
  return (
    <div className="landing-page">
      {/* Header / Navbar */}
      <Navbar />
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="landing-hero-content">
            <h1 className="landing-hero-title">Encontre a Sua Comunidade Católica</h1>
            <p className="landing-hero-subtitle">
              Descubra a paróquia mais próxima, consulte horários de missas, fique a par dos eventos e conecte-se com a sua fé.
            </p>
            <div className="landing-hero-ctas">
              <Link href="/paroquias" className="landing-btn-primary">
                Começar Agora <ArrowRight size={20} />
              </Link>
              <Link href="#como-funciona" className="landing-btn-tertiary">Saber Mais</Link>
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
              <ShieldCheck size={48} className="landing-hero-icon" />
              <p>Dados <strong>Verificados</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="landing-how-it-works">
        <div className="landing-container">
          <h2>Como Funciona</h2>
          <p className="landing-section-subtitle">Simplicidade para conectar-se com o que importa</p>
          <div className="landing-steps">
            {[
              { n: 1, t: 'Localize', d: 'Permita o acesso à localização ou pesquise por morada.' },
              { n: 2, t: 'Explore', d: 'Consulte horários de missas, confissões e atividades.' },
              { n: 3, t: 'Conecte', d: 'Participe na vida da sua nova comunidade paroquial.' }
            ].map((step) => (
              <div key={step.n} className="landing-step">
                <div className="landing-step-header">
                  <div className="landing-step-number">{step.n}</div>
                  <h3>{step.t}</h3>
                </div>
                <p>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="landing-features">
        <div className="landing-container">
          <h2>Recursos Principais</h2>
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon"><MapPin size={32} /></div>
              <h3>Encontre Paróquias</h3>
              <p>Localize igrejas próximas com direções integradas e contactos diretos.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Calendar size={32} /></div>
              <h3>Horários de Missa</h3>
              <p>Aceda a horários atualizados de celebrações e confissões.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon"><Heart size={32} /></div>
              <h3>Atividades Pastorais</h3>
              <p>Descubra grupos de oração, catequese e movimentos da sua paróquia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats">
        <div className="landing-container">
          <div className="landing-stats-grid">
            <div className="landing-stat">
              <span className="landing-stat-number">10K+</span>
              <p>Utilizadores Ativos</p>
            </div>
            <div className="landing-stat">
              <span className="landing-stat-number">500+</span>
              <p>Paróquias Registadas</p>
            </div>
            <div className="landing-stat">
              <span className="landing-stat-number">100%</span>
              <p>Gratuito e Seguro</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="landing-faq">
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
