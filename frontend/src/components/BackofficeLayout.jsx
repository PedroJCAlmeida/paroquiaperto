// BackofficeLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import BackofficeMenu from './BackofficeMenu';
import BackofficeNavbar from './BackofficeNavbar.jsx';
import '../styles/BackofficeLayout.css';

export default function BackofficeLayout() {
  return (
    <div className="backoffice-container">
      <main className="backoffice-content">
        <Outlet />
      </main>
    </div>
  );
}
