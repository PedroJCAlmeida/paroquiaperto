'use client';
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label="Alternar Tema"
    >
      <div className="theme-icon-container">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </div>
    </button>
  );
}