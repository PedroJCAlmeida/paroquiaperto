'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/Home.css';
import Navbar from '@/components/Navbar';
import { MapPin, Church, UsersRound, HandHeart } from 'lucide-react';
import BuscarParoquias from '@/components/BuscarParoquias';

const Home = () => {
  const router = useRouter();

  const handleEncontrar = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          localStorage.setItem('lat', latitude);
          localStorage.setItem('lng', longitude);
          router.push('/paroquias');
        },
        () => router.push('/paroquias')
      );
    } else {
      router.push('/paroquias');
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <header className="home-header">
        <div className="home-header-inner">
          <h1 className="home-logo">Paróquia Perto</h1>
          <nav className="home-nav">
            <a className="home-nav-link" href="/">Início</a>
            <a className="home-nav-link" href="/paroquias">Paróquias</a>
            <a className="home-nav-link" href="/contato">Contato</a>
          </nav>
        </div>
      </header>

      <div className="home-hero-wrap">
        <section className="home-hero">
          <div className="home-hero-inner">
            <h2 className="home-hero-title">
              Encontre a paróquia mais próxima de você
            </h2>
            <p className="home-hero-text">
              Com base na sua localização, mostramos a igreja católica mais perto.
            </p>
            <button className="home-hero-button" onClick={handleEncontrar}>
              <MapPin size={20} style={{ marginRight: '8px' }} />
              Encontrar Paróquia Perto
            </button>
          </div>
        </section>

        <div className="home-search-area">
          <BuscarParoquias embedded />
        </div>
      </div>

      <section className="home-highlights">
        <h3 className="home-highlights-title">Descubra o que pode fazer</h3>
        <div className="home-highlights-grid">
          <div className="home-highlight-card">
            <div className="home-highlight-header">
              <Church size={24} className="home-highlight-icon icon-encontre" />
              <h4>Encontre</h4>
            </div>
            <p>Veja qual paróquia está mais perto de você e conheça os horários de missa e celebrações.</p>
          </div>
          <div className="home-highlight-card">
            <div className="home-highlight-header">
              <UsersRound size={24} className="home-highlight-icon icon-participe" />
              <h4>Participe</h4>
            </div>
            <p>Fique por dentro dos eventos, grupos e atividades pastorais que acontecem na sua comunidade.</p>
          </div>
          <div className="home-highlight-card">
            <div className="home-highlight-header">
              <HandHeart size={24} className="home-highlight-icon icon-contribua" />
              <h4>Contribua</h4>
            </div>
            <p>Ajude sua paróquia local a continuar evangelizando com amor e proximidade.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
