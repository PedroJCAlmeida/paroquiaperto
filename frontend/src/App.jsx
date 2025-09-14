import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Paroquias from './pages/Paroquias';
import Contato from './pages/Contato';
import Buscar from './pages/Buscar';
import './assets/logo.png';
import './styles/Navbar.css';
import LoadingScreen from './components/LoadingScreen';
import PrivateRoute from './components/PrivateRoute';
import BackofficeLayout from './components/BackofficeLayout.jsx';
import InserirParoquia from './pages/InserirParoquia';
import InserirHorario from './pages/InserirHorario';
import InserirEvento from './pages/InserirEvento';
import Login from './pages/Login';
import Registar from './pages/RegistarUtilizador';
import ParoquiaDetalhe from './pages/ParoquiaDetalhe';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Quando a rota muda, ativa o loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); 
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '64px' }}>
        {loading ? (
          <LoadingScreen />
        ) : (
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/paroquias" element={<Paroquias />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/Buscar" element={<Buscar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registar />} /> 
            <Route path="/paroquia/:id" element={<ParoquiaDetalhe />} />
            {/* outras rotas */}
            {/* Backoffice protegido por PrivateRoute */}
            <Route path="/backoffice" element={<PrivateRoute />}>
              <Route element={<BackofficeLayout />}>
                <Route path="paroquias" element={<InserirParoquia />} />
                <Route path="horarios" element={<InserirHorario />} />
                <Route path="eventos" element={<InserirEvento />} />
              </Route>
            </Route>
          </Routes>
        )}
      </main>
    </>
  );
}

export default App;
