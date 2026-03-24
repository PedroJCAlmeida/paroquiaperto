'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Church, Calendar, CalendarDays, PlusCircle } from 'lucide-react';
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
      icon: <Church size={32} color="#2563eb" />,
      color: '#2563eb',
      listHref: '/backoffice/paroquias/listar',
      addHref: '/backoffice/paroquias',
    },
    {
      label: 'Horários',
      count: stats.horarios,
      icon: <Calendar size={32} color="#7c3aed" />,
      color: '#7c3aed',
      listHref: '/backoffice/horarios/listar',
      addHref: '/backoffice/horarios',
    },
    {
      label: 'Eventos',
      count: stats.eventos,
      icon: <CalendarDays size={32} color="#059669" />,
      color: '#059669',
      listHref: '/backoffice/eventos/listar',
      addHref: '/backoffice/eventos',
    },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
        Painel de Administração
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Bem-vindo ao backoffice. Gerencie paróquias, horários e eventos.
      </p>

      {error && (
        <p style={{ color: '#e11d48', background: '#fff1f2', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.5rem' }}>
          Erro ao carregar estatísticas. Verifique a ligação à base de dados.
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {card.icon}
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: card.color, lineHeight: 1 }}>
              {loading ? '—' : card.count}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link
                href={card.listHref}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: '#f1f5f9',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                Listar
              </Link>
              <Link
                href={card.addHref}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: card.color,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <PlusCircle size={14} />
                Inserir
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
