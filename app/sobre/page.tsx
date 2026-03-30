import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/StaticPage.css';
import { Church, MapPin, Heart, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre nós — Paróquia Perto',
  description: 'Conheça a missão e a equipa por trás do Paróquia Perto.',
};

export default function Sobre() {
  return (
    <>
      <Navbar />
      <main className="static-page">
        <header className="static-page-header">
          <div className="static-page-icon">
            <Church size={48} />
          </div>
          <h1 className="static-page-title">Sobre o Paróquia Perto</h1>
          <p className="static-page-subtitle">A nossa missão é aproximar as pessoas da sua comunidade de fé.</p>
        </header>
        <hr className="static-page-divider" />

        <section className="static-section">
          <h2 className="static-section-title">
            <Heart size={20} />
            A Nossa Missão
          </h2>
          <p>
            O <strong>Paróquia Perto</strong> nasceu com o objetivo de facilitar o acesso à informação sobre as paróquias católicas em Portugal. Acreditamos que a proximidade com a comunidade de fé é um valor essencial e que a tecnologia pode ser um veículo poderoso para reforçar essa ligação.
          </p>
          <p>
            A nossa plataforma permite que qualquer pessoa encontre, em segundos, a paróquia mais próxima de si, consulte os horários das celebrações, descubra eventos e saiba como participar ativamente na sua comunidade paroquial.
          </p>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <MapPin size={20} />
            O Que Oferecemos
          </h2>
          <ul>
            <li><strong>Localização geográfica</strong> — encontre a paróquia mais próxima com base na sua localização atual.</li>
            <li><strong>Horários de missas</strong> — consulte os horários das celebrações de cada paróquia, incluindo fins de semana e dias santos.</li>
            <li><strong>Eventos paroquiais</strong> — fique a par das iniciativas, catequeses, encontros e outros eventos da sua comunidade.</li>
            <li><strong>Pesquisa avançada</strong> — filtre paróquias por distrito, concelho ou raio de distância.</li>
            <li><strong>Informação de contacto</strong> — aceda rapidamente ao e-mail, site, redes sociais e WhatsApp de cada paróquia.</li>
          </ul>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <Users size={20} />
            A Nossa Equipa
          </h2>
          <p>
            Somos uma equipa de voluntários e entusiastas da tecnologia que partilham uma ligação à fé e à comunidade católica em Portugal. Desenvolvemos e mantemos esta plataforma de forma independente, com o objetivo de servir o bem comum.
          </p>
          <p>
            Se deseja contribuir, reportar um erro, ou sugerir uma melhoria, entre em contacto connosco através da página de <a href="/contacto">Contacto</a>.
          </p>
        </section>

        <div className="static-highlight">
          Este projeto é totalmente gratuito e sem fins lucrativos. Não exibimos publicidade nem comercializamos dados dos nossos utilizadores.
        </div>

        <div className="static-contact-cta">
          <h3>Quer saber mais ou colaborar?</h3>
          <p>Estamos sempre abertos a sugestões, parcerias e colaborações paroquiais.</p>
          <a href="/contacto">Fale Connosco</a>
        </div>

        <p className="static-updated">Última atualização: março de 2025</p>
      </main>
      <Footer />
    </>
  );
}
