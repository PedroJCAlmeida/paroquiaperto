'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import '@/styles/Contato.css';
import { Mail, Facebook, Instagram } from 'lucide-react';

const Contato = () => {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sua mensagem foi enviada com sucesso!');
    setForm({ nome: '', email: '', mensagem: '' });
  };

  return (
    <>
      <Navbar />
      <div className="contato-page">
          <h2 className="contato-title">Fale Conosco</h2>
          <div className="contato-grid">
            <form className="contato-form" onSubmit={handleSubmit}>
              <label>
                Nome
                <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome completo" required />
              </label>
              <label>
                E‑mail
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@exemplo.com" required />
              </label>
              <label>
                Mensagem
                <textarea name="mensagem" rows="5" value={form.mensagem} onChange={handleChange} placeholder="Escreva sua mensagem..." required />
              </label>
              <button type="submit" className="contato-submit">Enviar Mensagem</button>
              {status && <p className="contato-status">{status}</p>}
            </form>
            <div className="contato-redes">
              <a href="mailto:contato@paroquiaperto.com" className="rede-card">
                <Mail size={32} className="rede-icon" />
                <div className="rede-info">
                  <span className="rede-titulo">E‑mail</span>
                  <span className="rede-texto">contato@paroquiaperto.com</span>
                </div>
              </a>
              <a href="https://facebook.com/paroquiaperto" target="_blank" rel="noreferrer" className="rede-card">
                <Facebook size={32} className="rede-icon" />
                <div className="rede-info">
                  <span className="rede-titulo">Facebook</span>
                  <span className="rede-texto">/paroquiaperto</span>
                </div>
              </a>
              <a href="https://instagram.com/paroquiaperto" target="_blank" rel="noreferrer" className="rede-card">
                <Instagram size={32} className="rede-icon" />
                <div className="rede-info">
                  <span className="rede-titulo">Instagram</span>
                  <span className="rede-texto">@paroquiaperto</span>
                </div>
              </a>
            </div>
          </div>
        </div>
    </>
  );
};

export default Contato;
