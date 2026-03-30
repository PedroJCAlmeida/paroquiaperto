import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import '@/styles/Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/paroquiaperto', icon: FaFacebook },
    { name: 'Instagram', url: 'https://instagram.com/paroquiaperto', icon: FaInstagram },
    { name: 'WhatsApp', url: 'https://wa.me/351911837861', icon: FaWhatsapp },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        {/* Brand */}
        <div className="site-footer-brand">
          <span className="site-footer-brand-name">Paróquia Perto</span>
          <p className="site-footer-brand-desc">
            Encontre a paróquia católica mais próxima de si, consulte horários de missas e fique a par dos eventos da sua comunidade.
          </p>
          {/* Social Links */}
          <div className="site-footer-social">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="site-footer-social-link"
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="site-footer-col">
          <h4>Navegação</h4>
          <ul>
            <li><Link href="/">Início</Link></li>
            <li><Link href="/paroquias">Paróquias</Link></li>
            <li><Link href="/buscar">Buscar</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
            <li><Link href="/sobre">Sobre nós</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="site-footer-col">
          <h4>Legal</h4>
          <ul>
            <li><Link href="/politicas">Política de Privacidade</Link></li>
            <li><Link href="/rgpd">RGPD</Link></li>
            <li><Link href="/cookies">Política de Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {year} Paróquia Perto. Todos os direitos reservados.</span>
        <span className="site-footer-separator">·</span>
        <Link href="/politicas">Privacidade</Link>
        <span className="site-footer-separator">·</span>
        <Link href="/rgpd">RGPD</Link>
        <span className="site-footer-separator">·</span>
        <Link href="/cookies">Cookies</Link>
      </div>
    </footer>
  );
}
