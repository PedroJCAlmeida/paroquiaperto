'use client';
import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti'; // Opcional: para celebrar quando houver muitos dados!
import Link from 'next/link';
import { Church, Calendar, CalendarDays, PlusCircle, ArrowRight, Users } from 'lucide-react';
import '@/styles/Backoffice.css';
import type { Paroquia, Horario, Evento } from '@/types';

interface Stats {
  paroquias: number;
  horarios: number;
  eventos: number;
}

export default function BackofficeDashboard() {
  const [stats, setStats] = useState<Stats>({ paroquias: 0, horarios: 0, eventos: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/paroquias').then((r) => r.json()),
      fetch('/api/horarios').then((r) => r.json()),
      fetch('/api/eventos').then((r) => r.json()),
    ])
      .then(([paroquias, horarios, eventos]) => {
        setStats({
          paroquias: Array.isArray(paroquias) ? paroquias.length : 0,
          horarios: Array.isArray(horarios) ? horarios.length : 0,
          eventos: Array.isArray(eventos) ? eventos.length : 0,
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: 'Paróquias',
      count: stats.paroquias,
      icon: <Church size={24} />,
      color: '#6366f1', // Indigo
      bg: '#eef2ff',
      listHref: '/backoffice/paroquias/listar',
      addHref: '/backoffice/paroquias/novo',
    },
    {
      label: 'Horários',
      count: stats.horarios,
      icon: <Calendar size={24} />,
      color: '#f59e0b', // Amber
      bg: '#fffbeb',
      listHref: '/backoffice/horarios/listar',
      addHref: '/backoffice/horarios',
    },
    {
      label: 'Eventos',
      count: stats.eventos,
      icon: <CalendarDays size={24} />,
      color: '#10b981', // Emerald
      bg: '#ecfdf5',
      listHref: '/backoffice/eventos/listar',
      addHref: '/backoffice/eventos',
    },
  ];

  return (
    <div className="bo-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="bo-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>
          Painel de Administração
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Bem-vindo ao backoffice. Gerencie o ecossistema da sua plataforma num só lugar.
        </p>
      </header>

      {error && (
        <div style={{ color: '#e11d48', background: '#fff1f2', padding: '1.25rem', borderRadius: 16, marginBottom: '2rem', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>⚠️ Erro ao carregar estatísticas. Verifique a ligação à base de dados.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {cards.map((card) => (
          <div 
            key={card.label} 
            className="bo-card" 
            style={{ 
              background: '#fff', 
              borderRadius: '20px', 
              padding: '1.5rem', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: card.bg, color: card.color }}>
                  {card.icon}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', color: '#64748b', fontWeight: '500', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total de {card.label}
                  </span>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {loading ? <span className="animate-pulse">...</span> : card.count}
                  </h2>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
              <Link href={card.listHref} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', background: '#f8fafc', color: '#475569', fontWeight: '600', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                Ver Lista <ArrowRight size={16} />
              </Link>
              <Link href={card.addHref} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', background: '#243B55', color: '#fff', fontWeight: '600', textDecoration: 'none' }}>
                <PlusCircle size={16} /> Inserir
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* SECÇÃO EXTRA: Sugestão de Atalhos Rápidos */}
      <section style={{ marginTop: '4rem', padding: '2rem', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
        <h3 style={{ color: '#475569', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} /> Atalhos Rápidos
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/backoffice/configuracoes" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>→ Configurações do Sistema</Link>
          <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>→ Visualizar Site Público</Link>
        </div>
      </section>

      <style jsx>{`
        .bo-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
