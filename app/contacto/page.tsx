'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/Contato.css';
import { Mail, Facebook, Instagram } from 'lucide-react';

interface ContactForm {
  nome: string;
  email: string;
  mensagem: string;
}

const Contacto = () => {
  const [form, setForm] = useState<ContactForm>({ nome: '', email: '', mensagem: '' });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sua mensagem foi enviada com sucesso!');
    setForm({ nome: '', email: '', mensagem: '' });
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#181f2c] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-2 pt-24 md:pt-28">
        <div className="w-full max-w-5xl mx-auto">
          <header className="mb-8 contacto-header">
            <h2 className="contacto-title">Contacto</h2>
            <p className="contacto-subtitle">Estamos aqui para ouvir a sua comunidade</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Formulário */}
            <form onSubmit={handleSubmit} className="md:col-span-2 bg-[#FAF8F4] dark:bg-[#232e3e] rounded-2xl md:rounded-2xl rounded-lg p-4 md:p-8 flex flex-col gap-6 border border-[rgba(156,122,70,0.15)] dark:border-[#2d384d] shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.35)] transition-colors duration-300">
              <div>
                <label className="block font-bold text-[#1F2F46] dark:text-gray-100 mb-1 transition-colors">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                  className="w-full rounded-lg border border-[#e2e8f0] dark:border-[#444] px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#9c7a46] focus:border-[#9c7a46] bg-white dark:bg-[#232326] dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-colors"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1F2F46] dark:text-gray-100 mb-1 transition-colors">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="exemplo@email.com"
                  required
                  className="w-full rounded-lg border border-[#e2e8f0] dark:border-[#444] px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#9c7a46] focus:border-[#9c7a46] bg-white dark:bg-[#232326] dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-colors"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1F2F46] dark:text-gray-100 mb-1 transition-colors">Mensagem</label>
                <textarea
                  name="mensagem"
                  rows={3}
                  value={form.mensagem}
                  onChange={handleChange}
                  placeholder="Como podemos ajudar?"
                  required
                  className="w-full rounded-lg border border-[#e2e8f0] dark:border-[#444] px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#9c7a46] focus:border-[#9c7a46] bg-white dark:bg-[#232326] dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm resize-none transition-colors"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#1F2F46] to-[#334155] dark:bg-[#181f2c] dark:from-none dark:to-none text-white font-bold py-3 rounded-xl shadow-md hover:from-[#243B55] hover:to-[#1F2F46] dark:hover:bg-[#232e3e] transition-all text-lg mt-2">
                Enviar Mensagem
              </button>
              {status && <p className="text-green-600 text-center font-semibold mt-2">{status}</p>}
            </form>
            {/* Redes Sociais */}
            <aside className="flex flex-col gap-4 justify-start">
              <h3 className="text-xl font-bold text-[#1F2F46] dark:text-gray-100 mb-2 transition-colors">Contactos & Redes Sociais</h3>
              <a href="mailto:contacto@paroquiaperto.pt" className="flex items-center gap-3 bg-[#FAF8F4] dark:bg-[#232e3e] rounded-xl border border-[#e2e8f0] dark:border-[#2d384d] shadow-sm px-5 py-4 hover:bg-[#f3ede2] dark:hover:bg-[#232326] transition-colors">
                <Mail size={28} className="text-[#9C7A46]" />
                <span className="ml-2 text-[#64748b] dark:text-gray-300 transition-colors">contacto@paroquiaperto.pt</span>
              </a>
              <a href="https://facebook.com/paroquiaperto" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#FAF8F4] dark:bg-[#232e3e] rounded-xl border border-[#e2e8f0] dark:border-[#2d384d] shadow-sm px-5 py-4 hover:bg-[#f3ede2] dark:hover:bg-[#232326] transition-colors">
                <Facebook size={28} className="text-[#9C7A46]" />
                <span className="ml-2 text-[#64748b] dark:text-gray-300 transition-colors">/paroquiaperto</span>
              </a>
              <a href="https://instagram.com/paroquiaperto" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#FAF8F4] dark:bg-[#232e3e] rounded-xl border border-[#e2e8f0] dark:border-[#2d384d] shadow-sm px-5 py-4 hover:bg-[#f3ede2] dark:hover:bg-[#232326] transition-colors">
                <Instagram size={28} className="text-[#9C7A46]" />
                <span className="ml-2 text-[#64748b] dark:text-gray-300 transition-colors">@paroquiaperto</span>
              </a>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;