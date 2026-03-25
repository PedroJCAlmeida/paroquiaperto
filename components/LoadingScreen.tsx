'use client';
import React from 'react';
import '@/styles/LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <img src="/logo_paroquia.png" alt="Paróquia Perto" className="loading-logo" />
    </div>
  );
};

export default LoadingScreen;
