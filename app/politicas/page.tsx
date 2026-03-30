import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/StaticPage.css';
import { Shield, Eye, Database, Lock, UserCheck, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Paróquia Perto',
  description: 'Saiba como tratamos os seus dados pessoais no Paróquia Perto.',
};

export default function Politicas() {
  return (
    <>
      <Navbar />
      <main className="static-page">
        <header className="static-page-header">
          <div className="static-page-icon">
            <Shield size={48} />
          </div>
          <h1 className="static-page-title">Política de Privacidade</h1>
          <p className="static-page-subtitle">Como recolhemos, utilizamos e protegemos os seus dados pessoais.</p>
        </header>
        <hr className="static-page-divider" />

        <section className="static-section">
          <h2 className="static-section-title">
            <Eye size={20} />
            Introdução
          </h2>
          <p>
            A sua privacidade é importante para nós. Esta Política de Privacidade descreve de que forma o <strong>Paróquia Perto</strong> recolhe, utiliza, armazena e protege as informações que nos fornece ao utilizar a nossa plataforma, disponível em <strong>paroquiaperto.pt</strong>.
          </p>
          <p>
            Ao utilizar os nossos serviços, aceita as práticas descritas nesta política. Se não concordar com algum dos termos, pedimos que não utilize a plataforma.
          </p>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <Database size={20} />
            Dados que Recolhemos
          </h2>
          <p>Podemos recolher as seguintes categorias de dados:</p>
          <ul>
            <li><strong>Dados de conta:</strong> nome, endereço de e-mail e palavra-passe (encriptada) quando cria uma conta.</li>
            <li><strong>Dados de localização:</strong> coordenadas geográficas, solicitadas apenas quando utiliza a funcionalidade &quot;Paróquia Perto&quot;, mediante o seu consentimento expresso.</li>
            <li><strong>Dados de navegação:</strong> endereço IP, tipo de browser, páginas visitadas e tempo de permanência (recolhidos de forma anónima para fins estatísticos).</li>
            <li><strong>Comunicações:</strong> mensagens enviadas através do formulário de contacto.</li>
          </ul>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <UserCheck size={20} />
            Como Utilizamos os Seus Dados
          </h2>
          <p>Os dados recolhidos são utilizados para:</p>
          <ul>
            <li>Fornecer e melhorar os nossos serviços;</li>
            <li>Gerir a sua conta e autenticar o acesso;</li>
            <li>Mostrar paróquias próximas da sua localização;</li>
            <li>Responder às suas mensagens e pedidos de suporte;</li>
            <li>Enviar notificações relacionadas com o serviço (sem fins comerciais);</li>
            <li>Produzir estatísticas anónimas de utilização.</li>
          </ul>
          <div className="static-highlight">
            Não vendemos, alugamos nem partilhamos os seus dados pessoais com terceiros para fins comerciais.
          </div>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <Lock size={20} />
            Segurança dos Dados
          </h2>
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger os seus dados contra acesso não autorizado, perda, alteração ou divulgação. As palavras-passe são armazenadas de forma encriptada e nunca em texto simples.
          </p>
          <p>
            No entanto, nenhuma transmissão de dados pela Internet é 100% segura. Embora nos esforcemos para proteger os seus dados, não podemos garantir a segurança absoluta das informações transmitidas.
          </p>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <UserCheck size={20} />
            Os Seus Direitos
          </h2>
          <p>Ao abrigo do RGPD, tem os seguintes direitos:</p>
          <ul>
            <li><strong>Acesso:</strong> solicitar uma cópia dos seus dados pessoais.</li>
            <li><strong>Retificação:</strong> corrigir dados inexatos ou incompletos.</li>
            <li><strong>Apagamento:</strong> solicitar a eliminação dos seus dados (&quot;direito a ser esquecido&quot;).</li>
            <li><strong>Portabilidade:</strong> receber os seus dados num formato estruturado e legível por máquina.</li>
            <li><strong>Oposição:</strong> opor-se ao tratamento dos seus dados em determinadas circunstâncias.</li>
          </ul>
          <p>Para exercer qualquer um destes direitos, contacte-nos através do endereço indicado abaixo.</p>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <Mail size={20} />
            Contacto
          </h2>
          <p>
            Para questões relacionadas com esta Política de Privacidade ou para exercer os seus direitos, contacte-nos em: <a href="mailto:privacidade@paroquiaperto.pt">privacidade@paroquiaperto.pt</a>
          </p>
        </section>

        <div className="static-contact-cta">
          <h3>Tem dúvidas sobre a sua privacidade?</h3>
          <p>A nossa equipa está disponível para esclarecer qualquer questão.</p>
          <a href="/contacto">Contactar</a>
        </div>

        <p className="static-updated">Última atualização: março de 2025</p>
      </main>
      <Footer />
    </>
  );
}
