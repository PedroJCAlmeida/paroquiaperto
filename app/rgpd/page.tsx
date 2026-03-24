import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/StaticPage.css';
import { FileText, Users, AlertCircle, Globe, Building2, Scale } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RGPD — Paróquia Perto',
  description: 'Informação sobre o cumprimento do Regulamento Geral de Proteção de Dados no Paróquia Perto.',
};

export default function Rgpd() {
  return (
    <>
      <Navbar />
      <main className="static-page">
        <header className="static-page-header">
          <div className="static-page-icon">
            <Scale size={48} />
          </div>
          <h1 className="static-page-title">RGPD</h1>
          <p className="static-page-subtitle">Regulamento Geral sobre a Proteção de Dados (UE) 2016/679</p>
        </header>
        <hr className="static-page-divider" />

        <section className="static-section">
          <h2 className="static-section-title">
            <FileText size={20} />
            O Que é o RGPD?
          </h2>
          <p>
            O Regulamento Geral sobre a Proteção de Dados (<strong>RGPD</strong>), também conhecido como GDPR (<em>General Data Protection Regulation</em>), é o regulamento europeu que uniformizou as regras de proteção de dados pessoais em todos os estados-membros da União Europeia, tendo entrado em vigor a 25 de maio de 2018.
          </p>
          <p>
            O RGPD confere aos cidadãos europeus maior controlo sobre os seus dados pessoais e estabelece obrigações claras para as entidades que tratam esses dados.
          </p>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <Building2 size={20} />
            Responsável pelo Tratamento
          </h2>
          <p>O responsável pelo tratamento dos dados pessoais recolhidos através da plataforma <strong>Paróquia Perto</strong> é:</p>
          <ul>
            <li><strong>Entidade:</strong> Paróquia Perto</li>
            <li><strong>E-mail:</strong> <a href="mailto:rgpd@paroquiaperto.pt">rgpd@paroquiaperto.pt</a></li>
          </ul>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <Globe size={20} />
            Base Legal para o Tratamento
          </h2>
          <p>O tratamento dos seus dados pessoais assenta nas seguintes bases legais previstas no artigo 6.º do RGPD:</p>
          <ul>
            <li><strong>Consentimento (al. a))</strong> — para a recolha de dados de localização e para o envio de comunicações não essenciais ao serviço.</li>
            <li><strong>Execução de contrato (al. b))</strong> — para a gestão da conta de utilizador e prestação do serviço solicitado.</li>
            <li><strong>Interesse legítimo (al. f))</strong> — para fins estatísticos anónimos e melhoria contínua do serviço.</li>
          </ul>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <Users size={20} />
            Direitos dos Titulares dos Dados
          </h2>
          <p>Enquanto titular dos dados, tem os seguintes direitos:</p>
          <ol>
            <li><strong>Direito de acesso (art. 15.º)</strong> — saber quais os dados que tratamos sobre si.</li>
            <li><strong>Direito de retificação (art. 16.º)</strong> — corrigir dados inexatos ou incompletos.</li>
            <li><strong>Direito ao apagamento (art. 17.º)</strong> — solicitar a eliminação dos seus dados.</li>
            <li><strong>Direito à limitação do tratamento (art. 18.º)</strong> — restringir o tratamento dos seus dados em determinadas circunstâncias.</li>
            <li><strong>Direito à portabilidade (art. 20.º)</strong> — receber os seus dados num formato estruturado e legível por máquina.</li>
            <li><strong>Direito de oposição (art. 21.º)</strong> — opor-se ao tratamento com base em interesse legítimo.</li>
            <li><strong>Direito de não ficar sujeito a decisões automatizadas (art. 22.º)</strong> — não ser alvo de decisões baseadas exclusivamente em tratamento automatizado.</li>
          </ol>
          <div className="static-highlight">
            Para exercer qualquer um destes direitos, envie um pedido para <a href="mailto:rgpd@paroquiaperto.pt">rgpd@paroquiaperto.pt</a>. Responderemos no prazo de 30 dias.
          </div>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <AlertCircle size={20} />
            Conservação dos Dados
          </h2>
          <p>
            Os seus dados pessoais são conservados pelo período estritamente necessário para as finalidades para as quais foram recolhidos:
          </p>
          <ul>
            <li><strong>Dados de conta:</strong> enquanto a conta se mantiver ativa, e até 90 dias após o seu pedido de eliminação.</li>
            <li><strong>Dados de localização:</strong> não são armazenados permanentemente; são utilizados apenas durante a sessão de navegação.</li>
            <li><strong>Mensagens de contato:</strong> conservadas por até 2 anos para fins de resposta e arquivo.</li>
            <li><strong>Dados de navegação:</strong> anonimizados e conservados por até 12 meses para fins estatísticos.</li>
          </ul>
        </section>

        <section className="static-section">
          <h2 className="static-section-title">
            <Scale size={20} />
            Reclamações
          </h2>
          <p>
            Se considerar que o tratamento dos seus dados viola o RGPD, tem o direito de apresentar uma reclamação junto da autoridade de controlo competente em Portugal:
          </p>
          <ul>
            <li>
              <strong>Comissão Nacional de Proteção de Dados (CNPD)</strong><br />
              <a href="https://www.cnpd.pt" target="_blank" rel="noreferrer">www.cnpd.pt</a>
            </li>
          </ul>
        </section>

        <div className="static-contact-cta">
          <h3>Dúvidas sobre os seus direitos RGPD?</h3>
          <p>O nosso encarregado de proteção de dados está disponível para o apoiar.</p>
          <a href="mailto:rgpd@paroquiaperto.pt">Contactar DPO</a>
        </div>

        <p className="static-updated">Última atualização: março de 2025</p>
      </main>
      <Footer />
    </>
  );
}
