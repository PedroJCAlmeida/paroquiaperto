'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import BuscarParoquias from '@/components/BuscarParoquias';

export default function Buscar() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <BuscarParoquias />
      </div>
    </>
  );
}
