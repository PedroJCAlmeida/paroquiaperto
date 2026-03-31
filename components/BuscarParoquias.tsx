'use client';
import React, { useState, useEffect } from 'react';
import '@/styles/BuscarParoquias.css';
import type { Paroquia, Distrito, Conselho } from '@/types';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Instale lucide-react se não tiver

interface BuscarParoquiasProps {
  embedded?: boolean;
}

function BuscarParoquias({ embedded = false }: BuscarParoquiasProps) {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [raio, setRaio] = useState(10);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [distrito, setDistrito] = useState('');
  const [conselho, setConselho] = useState('');
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- Estados da Paginação ---
  const [paginaAtual, setPaginaAtual] = useState(1);
  const paroquiasPorPagina = 12; 

  const buscaTrim = busca.trim().toLowerCase();

  // Resetar para a página 1 sempre que um filtro mudar
  useEffect(() => {
    setPaginaAtual(1);
  }, [buscaTrim, raio, lat, lng, distrito, conselho]);

  useEffect(() => {
    const savedLat = localStorage.getItem('lat');
    const savedLng = localStorage.getItem('lng');
    if (savedLat && savedLng) {
      setLat(Number(savedLat));
      setLng(Number(savedLng));
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/distritos')
      .then((res) => res.json())
      .then((data: Distrito[]) => setDistritos(Array.isArray(data) ? data : []))
      .catch(() => setDistritos([]));
  }, []);

  useEffect(() => {
    if (!distrito) {
      setConselhos([]);
      setConselho('');
      return;
    }
    fetch(`/api/conselhos?distritoId=${distrito}`)
      .then((res) => res.json())
      .then((data: Conselho[]) => setConselhos(Array.isArray(data) ? data : []))
      .catch(() => setConselhos([]));
    setConselho('');
  }, [distrito]);

  useEffect(() => {
    if (!buscaTrim && !lat && !distrito) {
      setParoquias([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const params = new URLSearchParams();
    if (buscaTrim) params.append('search', buscaTrim);
    if (distrito) params.append('distrito', distrito);
    if (conselho) params.append('conselho', conselho);
    if (lat && lng && !distrito) {
      params.append('lat', lat.toString());
      params.append('lng', lng.toString());
      params.append('raio', raio.toString());
    }

    fetch(`/api/paroquias?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setParoquias(Array.isArray(data) ? data : []))
      .catch(() => setParoquias([]));
  }, [buscaTrim, raio, lat, lng, distrito, conselho]);

  // --- Lógica de Paginação ---
  const indiceUltima = paginaAtual * paroquiasPorPagina;
  const indicePrimeira = indiceUltima - paroquiasPorPagina;
  const paroquiasExibidas = paroquias.slice(indicePrimeira, indiceUltima);
  const totalPaginas = Math.ceil(paroquias.length / paroquiasPorPagina);

  return (
    <div
      style={{
        minHeight: embedded ? undefined : '100vh',
        background: embedded ? 'transparent' : 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)',
        paddingBottom: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: 980, width: '100%', margin: '0 auto', paddingTop: 56, paddingLeft: 16, paddingRight: 16 }}>
        {!embedded && (
          <h2 style={{ textAlign: 'center', fontSize: '2.3rem', fontWeight: 900, color: '#243B55', letterSpacing: '1.5px', marginBottom: 32, textShadow: '0 2px 16px #e0e7ff' }}>
            Buscar Paróquias
          </h2>
        )}
        
        {/* Formulário (Mantido igual ao seu) */}
        <form style={{ /* Seus estilos atuais */ }}>
            {/* ... Seus inputs e selects ... */}
        </form>

        <div style={{ marginTop: 48 }}>
          {hasSearched && (
            <p style={{ textAlign: 'center', fontSize: '1.18rem', color: paroquias.length > 0 ? '#243B55' : '#e11d48', fontWeight: 700, marginBottom: 22 }}>
              {paroquias.length > 0 ? `Encontradas ${paroquias.length} paróquias.` : 'Nenhuma paróquia encontrada.'}
            </p>
          )}

          {/* Grid de Resultados (Usa agora paroquiasExibidas) */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))', gap: isMobile ? '18px' : '32px' }}>
            {paroquiasExibidas.map((p) => (
               <div key={p.id} style={{ background: 'linear-gradient(120deg,#fff 80%,#fde68a 100%)', borderRadius: '22px', boxShadow: '0 6px 32px rgba(60,60,120,0.15)', padding: '28px 22px', display: 'flex', gap: '18px', alignItems: 'flex-start', minHeight: 180, border: '2px solid #A67C52' }}>
                  {/* ... Conteúdo do seu card ... */}
               </div>
            ))}
          </div>

          {/* --- Componente de Paginação (Só aparece se totalPaginas > 1) --- */}
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 40 }}>
              <button
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(prev => prev - 1)}
                style={{ padding: '10px', borderRadius: '50%', border: '1px solid #A67C52', background: paginaAtual === 1 ? '#f3f3f3' : '#fff', cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer', color: '#A67C52' }}
              >
                <ChevronLeft size={24} />
              </button>
              
              <div style={{ display: 'flex', gap: 8 }}>
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPaginaAtual(i + 1)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      border: 'none',
                      background: paginaAtual === i + 1 ? '#A67C52' : '#fff',
                      color: paginaAtual === i + 1 ? '#fff' : '#243B55',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual(prev => prev + 1)}
                style={{ padding: '10px', borderRadius: '50%', border: '1px solid #A67C52', background: paginaAtual === totalPaginas ? '#f3f3f3' : '#fff', cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer', color: '#A67C52' }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuscarParoquias;
