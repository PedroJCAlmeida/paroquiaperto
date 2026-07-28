'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Paroquia } from '@/types';

interface ParoquiaAdminRowProps {
  paroquia: Paroquia;
  onEdit: (paroquia: Paroquia) => void;
  onDelete: (id: number, nome: string) => void;
}

export default function ParoquiaAdminRow({ paroquia, onEdit, onDelete }: ParoquiaAdminRowProps) {
  return (
    <div className="bo-list-item" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.2rem' }}>{paroquia.nome}</div>
        <div style={{ color: '#64748b', fontSize: '1rem', marginTop: '4px' }}>
          {`${paroquia.rua}${paroquia.numeroPorta ? `, ${paroquia.numeroPorta}` : ''} - ${paroquia.codigoPostal} ${paroquia.localidade}`}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => onEdit(paroquia)} className="bo-btn bo-btn-light" style={{ padding: '12px 22px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}><Pencil size={18} /> Editar</button>
        <button onClick={() => onDelete(paroquia.id, paroquia.nome)} className="bo-btn bo-btn-light" style={{ color: '#e11d48', padding: '12px 22px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}><Trash2 size={18} /> Remover</button>
      </div>
    </div>
  );
}