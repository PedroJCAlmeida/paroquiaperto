// BackofficeLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import BackofficeMenu from './BackofficeMenu';
import '../styles/BackofficeLayout.css';

export default function BackofficeLayout() {
  const BackofficeNavbar = require('./BackofficeNavbar.jsx').default;
  return (
    <div className="backoffice-container">
      <BackofficeNavbar />
      <main className="backoffice-content">
        <Outlet />
      </main>
    </div>
  );
}
