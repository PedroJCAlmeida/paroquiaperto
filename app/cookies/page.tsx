import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/StaticPage.css';
import { Cookie, Settings, BarChart2, ShieldCheck, ToggleRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies — Paróquia Perto',
  description: 'Saiba que cookies utilizamos no Paróquia Perto e como as pode gerir.',
};

export default function Cookies() {
  return (
    <>
      <Navbar />
      <main className="static-page">
        <header className="static-page-header">
          <div className="static-page-icon">
            <Cookie size={48} />
          </div>
          <h1 className="static-page-title">Política de Cookies</h1>
          <p className="static-page-subtitle">O que são cookies, quais utilizamos e como as pode gerir.</p>
        </header>
        <hr className="static-page-divider" />

        <section className="static-section">
          <h2 className="static-section-title">
            <Cookie size={20} />
            O Que São Cookies?
          </h2>
          <p>
            Cookies são pequenos ficheiros de texto que um website armazena no seu dispositivo (computador, tablet ou telemóvel) quando o visita. Permitem que o site recorde as suas preferências e ações ao longo do tempo, melhorando a sua experiência de navegação.
          </p>
          <p>
            As cookies podem ser <strong>de sessão</strong> (eliminadas quando fecha o browser) ou <strong>persistentes</strong> (permanecem no dispositivo por um período definido).
          </p>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <ShieldCheck size={20} />
            Cookies Estritamente Necessárias
          </h2>
          <p>
            Estas cookies são indispensáveis para o funcionamento básico da plataforma. Sem elas, alguns serviços não podem ser prestados. Não requerem o seu consentimento, pois são essenciais ao serviço.
          </p>
          <ul>
            <li><strong>token</strong> — armazena o seu token de autenticação para manter a sessão iniciada. Duração: sessão.</li>
            <li><strong>role</strong> — identifica as permissões do utilizador autenticado. Duração: sessão.</li>
            <li><strong>theme</strong> — memoriza a sua preferência de modo claro/escuro. Duração: 1 ano.</li>
          </ul>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <Settings size={20} />
            Cookies de Preferências
          </h2>
          <p>
            Estas cookies permitem que o site recorde escolhas que fez para proporcionar funcionalidades melhoradas e personalizadas.
          </p>
          <ul>
            <li><strong>lat / lng</strong> — guarda a sua última localização geográfica para apresentar paróquias próximas mais rapidamente. Duração: sessão.</li>
          </ul>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <BarChart2 size={20} />
            Cookies de Análise
          </h2>
          <p>
            Utilizamos cookies de análise para compreender como os visitantes interagem com o site, permitindo-nos melhorar continuamente a experiência. Todos os dados são tratados de forma anónima e agregada.
          </p>
          <div className="static-highlight">
            Não utilizamos cookies de publicidade nem partilhamos dados de análise com terceiros para fins comerciais.
          </div>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <ToggleRight size={20} />
            Como Gerir as Cookies
          </h2>
          <p>
            Pode controlar e/ou eliminar as cookies como entender — para mais informações, consulte <a href="https://www.aboutcookies.org" target="_blank" rel="noreferrer">aboutcookies.org</a>. Pode eliminar todas as cookies já armazenadas no seu computador e pode configurar a maioria dos browsers para impedir que sejam colocadas.
          </p>
          <p>
            Se o fizer, poderá ter de ajustar manualmente algumas preferências sempre que visitar o site, e alguns serviços e funcionalidades poderão não funcionar corretamente.
          </p>
          <p><strong>Como gerir cookies nos principais browsers:</strong></p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
          </ul>
        </section>

        <div className="static-contact-cta">
          <h3>Ainda tem dúvidas sobre cookies?</h3>
          <p>Contacte-nos e teremos todo o gosto em esclarecer.</p>
          <a href="/contacto">Contactar</a>
        </div>

        <p className="static-updated">Última atualização: março de 2025</p>
      </main>
      <Footer />
    </>
  );
}
