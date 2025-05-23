import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { MapPin } from 'lucide-react';
import BuscaIgrejas from '../components/BuscaIgrejas';

const Home = () => {
  const navigate = useNavigate();

  const handleEncontrar = () => {
    // 1) opcional: disparar a geolocalização agora
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // aqui você poderia armazenar em contexto / localStorage
          const { latitude, longitude } = pos.coords;
          localStorage.setItem('lat', latitude);
          localStorage.setItem('lng', longitude);
          // 2) navegar para a página de paróquias
          navigate('/paroquias');
        },
        () => {
          // se falhar, mesmo assim navega
          navigate('/paroquias');
        }
      );
    } else {
      navigate('/paroquias');
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-header-inner">
          <h1 className="home-logo">Paróquia Perto</h1>
          <nav className="home-nav">
            <a href="/">Início</a>
            <a href="/paroquias">Paróquias</a>
            <a href="/contato">Contato</a>
          </nav>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-inner">
          <h2 className="home-hero-title">
            Encontre a paróquia mais próxima de você
          </h2>
          <p className="home-hero-text">
            Com base na sua localização, mostramos a igreja católica mais perto.
          </p>
          <button
            className="home-hero-button"
            onClick={handleEncontrar}
          >
            <MapPin size={20} style={{ marginRight: '8px' }} />
            Encontrar Paróquia Perto
          </button>
        </div>
      </section>

     <BuscaIgrejas/>
     

    </div>
    
  );
};
export default Home;