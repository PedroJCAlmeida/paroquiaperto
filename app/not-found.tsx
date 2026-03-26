import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Compass, Home, Search } from 'lucide-react';
import type { Metadata } from 'next';
import '@/styles/ErrorPage.css';

export const metadata: Metadata = {
  title: 'Página não encontrada — Paróquia Perto',
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="error-page">
        <div className="error-page-icon">
          <Compass size={48} />
        </div>

        <p className="error-page-code">404</p>
        <h1 className="error-page-title">Página não encontrada</h1>
        <p className="error-page-description">
          Não conseguimos encontrar a página que procura. É possível que tenha sido removida,
          renomeada ou que o endereço esteja incorreto.
        </p>

        <div className="error-page-actions">
          <Link href="/" className="error-page-btn-primary">
            <Home size={16} />
            Voltar ao início
          </Link>
          <Link href="/buscar" className="error-page-btn-secondary">
            <Search size={16} />
            Pesquisar paróquias
          </Link>
        </div>

        <hr className="error-page-divider" />

        <ul className="error-page-suggestions" aria-label="Sugestões de navegação">
          <li><Link href="/paroquias">Paróquias</Link></li>
          <li aria-hidden="true" className="error-page-suggestions-sep">·</li>
          <li><Link href="/sobre">Sobre nós</Link></li>
          <li aria-hidden="true" className="error-page-suggestions-sep">·</li>
          <li><Link href="/contacto">Contacto</Link></li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
