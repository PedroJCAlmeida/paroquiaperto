import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Paroquias from './pages/Paroquias';
import Contato from './pages/Contato';
import Buscar from './pages/Buscar';
import './assets/logo.png';

function App() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paroquias" element={<Paroquias />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/Buscar" element={<Buscar />} />
          {/* outras rotas */}
        </Routes>
      </main>
    </>
  );
}

export default App;
