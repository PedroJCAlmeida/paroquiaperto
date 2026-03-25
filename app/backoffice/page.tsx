'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Church, Calendar, CalendarDays, PlusCircle } from 'lucide-react';
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
      fetch('/api/paroquias').then((r) => r.json()) as Promise<Paroquia[]>,
      fetch('/api/horarios').then((r) => r.json()) as Promise<Horario[]>,
      fetch('/api/eventos').then((r) => r.json()) as Promise<Evento[]>,
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
      icon: <Church size={28} className="text-blue" />,
      listHref: '/backoffice/paroquias/listar',
      addHref: '/backoffice/paroquias',
    },
    {
      label: 'Horários',
      count: stats.horarios,
      icon: <Calendar size={28} className="text-blue" />,
      listHref: '/backoffice/horarios/listar',
      addHref: '/backoffice/horarios',
    },
    {
      label: 'Eventos',
      count: stats.eventos,
      icon: <CalendarDays size={28} style={{ color: '#059669' }} />,
      listHref: '/backoffice/eventos/listar',
      addHref: '/backoffice/eventos',
    },
  ];

  return (
    <div className="bo-container">
      <h1 className="bo-title">Painel de Administração</h1>
      <p className="bo-subtitle">
        Bem-vindo ao backoffice. Gerencie paróquias, horários e eventos.
      </p>

      {error && (
        <p style={{ color: '#e11d48', background: '#fff1f2', padding: '1rem', borderRadius: 12, marginBottom: '2rem' }}>
          Erro ao carregar estatísticas. Verifique a ligação à base de dados.
        </p>
      )}

      <div className="bo-grid-cards">
        {cards.map((card) => (
          <div key={card.label} className="bo-card">
            <div className="bo-card-header">
              {card.icon}
              <span className="bo-card-title">{card.label}</span>
            </div>
            <div className="bo-card-value">
              {loading ? '—' : card.count}
            </div>
            <div className="bo-card-actions">
              <Link href={card.listHref} className="bo-btn bo-btn-light">
                Listar
              </Link>
              <Link href={card.addHref} className="bo-btn bo-btn-primary">
                <PlusCircle size={16} />
                Inserir
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
