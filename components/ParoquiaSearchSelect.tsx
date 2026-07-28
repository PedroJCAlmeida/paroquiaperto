'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Church, ChevronDown, X } from 'lucide-react';
import type { Paroquia } from '@/types';

interface ParoquiaSearchSelectProps {
  paroquias: Paroquia[];
  value: string;
  onChange: (paroquiaId: string, paroquia: Paroquia | null) => void;
  selectedLabel?: string;
  label?: string;
  placeholder?: string;
  emptyMessage?: string;
}

export default function ParoquiaSearchSelect({
  paroquias,
  value,
  onChange,
  selectedLabel,
  label = 'Paróquia',
  placeholder = 'Pesquisar ou selecionar...',
  emptyMessage = 'Nenhum resultado.',
}: ParoquiaSearchSelectProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!value) {
      setSearchTerm('');
      return;
    }

    setSearchTerm(selectedLabel ?? '');
  }, [value, selectedLabel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const paroquiasExibidas = useMemo(() => {
    if (!searchTerm) return paroquias;
    return paroquias.filter((paroquia) => paroquia.nome.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [paroquias, searchTerm]);

  const selectParoquia = (paroquia: Paroquia) => {
    setSearchTerm(paroquia.nome);
    setIsDropdownOpen(false);
    onChange(String(paroquia.id), paroquia);
  };

  const clearSelection = () => {
    setSearchTerm('');
    onChange('', null);
  };

  return (
    <div className="form-group" style={{ position: 'relative', marginBottom: '20px' }} ref={dropdownRef}>
      <label>{label}</label>
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder={placeholder}
          className="form-input"
          style={{ paddingLeft: '40px', paddingRight: '40px', cursor: 'text' }}
          value={searchTerm}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
            onChange('', null);
          }}
          required
        />
        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '5px' }}>
          {searchTerm && <X size={16} onClick={clearSelection} style={{ color: '#94a3b8', cursor: 'pointer' }} />}
          <ChevronDown size={20} onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ color: '#243B55', cursor: 'pointer', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </div>
      </div>

      {isDropdownOpen && (
        <ul
          className="dropdown-menu-dark-compat"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            maxHeight: '250px',
            overflowY: 'auto',
            zIndex: 100,
            borderRadius: '8px',
            padding: '0',
            listStyle: 'none',
            backgroundColor: 'var(--dropdown-bg, #ffffff)',
            border: '1px solid var(--dropdown-border, #e2e8f0)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}
        >
          {paroquiasExibidas.length > 0 ? (
            paroquiasExibidas.map((paroquia) => (
              <li
                key={paroquia.id}
                onClick={() => selectParoquia(paroquia)}
                className="dropdown-item-dark-compat"
                style={{
                  padding: '12px 15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.9rem',
                  borderBottom: '1px solid var(--dropdown-border, #f1f5f9)',
                  color: 'var(--text-main-compat, #243B55)',
                  backgroundColor: String(paroquia.id) === value ? 'var(--dropdown-hover)' : 'transparent'
                }}
              >
                <Church size={14} opacity={0.6} />
                {paroquia.nome}
              </li>
            ))
          ) : (
            <li style={{ padding: '15px', textAlign: 'center', color: '#94a3b8' }}>
              {emptyMessage}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}