'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BuscarParoquias from '@/components/BuscarParoquias';

export default function Buscar() {
  return (
    <>
      <Navbar />
      <BuscarParoquias />
      <Footer />
    </>
  );
}
