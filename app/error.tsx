'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import '@/styles/ErrorPage.css';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="error-page">
        <div className="error-page-icon">
          <AlertTriangle size={48} />
        </div>

        <p className="error-page-code">500</p>
        <h1 className="error-page-title">Ocorreu um erro inesperado</h1>
        <p className="error-page-description">
          Pedimos desculpa pela inconveniência. Algo correu mal no nosso servidor.
          Pode tentar novamente ou voltar à página inicial.
        </p>

        <div className="error-page-actions">
          <button className="error-page-btn-primary" onClick={reset}>
            <RotateCcw size={16} />
            Tentar novamente
          </button>
          <Link href="/" className="error-page-btn-secondary">
            <Home size={16} />
            Voltar ao início
          </Link>
        </div>

        <hr className="error-page-divider" />

        <ul className="error-page-suggestions" aria-label="Sugestões de navegação">
          <li><Link href="/paroquias">Paróquias</Link></li>
          <li aria-hidden="true" className="error-page-suggestions-sep">·</li>
          <li><Link href="/buscar">Pesquisar</Link></li>
          <li aria-hidden="true" className="error-page-suggestions-sep">·</li>
          <li><Link href="/contacto">Contacto</Link></li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
