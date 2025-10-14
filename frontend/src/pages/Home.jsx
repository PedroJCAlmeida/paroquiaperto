import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Home.css';
import { MapPin, Church, HandsPraying, Heart } from 'lucide-react';
import BuscarParoquias from '../components/BuscarParoquias';

const Home = () => {
  const navigate = useNavigate();

  const handleEncontrar = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          localStorage.setItem('lat', latitude);
          localStorage.setItem('lng', longitude);
          navigate('/paroquias');
        },
        () => navigate('/paroquias')
      );
    } else {
      navigate('/paroquias');
    }
  };

  return (
    <main className="home-container">
      {/* 🔹 Navbar Global */}
      <Navbar />

      {/* 🔹 Hero */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <h2 className="home-hero-title">
            Encontre a paróquia mais próxima de você
          </h2>
          <p className="home-hero-text">
            Com base na sua localização, mostramos a igreja católica mais perto.
          </p>
          <button className="home-hero-button" onClick={handleEncontrar}>
            <MapPin size={20} className="icon" />
            Encontrar Paróquia Perto
          </button>
        </div>
      </section>

      {/* 🔹 BuscarParóquias centralizado */}
      <div className="home-search-area">
        <BuscarParoquias />
      </div>

      {/* 🔹 Destaques */}
      <section className="home-highlights">
        <h3 className="home-highlights-title">Descubra o que pode fazer</h3>
        <div className="home-highlights-grid">
          <div className="home-highlight-card">
            <div className="home-highlight-header">
              <Church size={24} color="#273E54" />
              <h4>Encontre</h4>
            </div>
            <p>
              Veja qual paróquia está mais perto de você e conheça os horários de missa e celebrações.
            </p>
          </div>

          <div className="home-highlight-card">
            <div className="home-highlight-header">
              <HandsPraying size={24} color="#273E54" />
              <h4>Participe</h4>
            </div>
            <p>
              Fique por dentro dos eventos, grupos e atividades pastorais que acontecem na sua comunidade.
            </p>
          </div>

          <div className="home-highlight-card">
            <div className="home-highlight-header">
              <Heart size={24} color="#273E54" />
              <h4>Contribua</h4>
            </div>
            <p>
              Ajude sua paróquia local a continuar evangelizando com amor e proximidade.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
