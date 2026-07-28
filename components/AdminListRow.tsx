'use client';

import React from 'react';

interface AdminListRowProps {
  title: string;
  subtitle?: React.ReactNode;
  actions: React.ReactNode;
  badge?: React.ReactNode;
}

export default function AdminListRow({ title, subtitle, actions, badge }: AdminListRowProps) {
  return (
    <div className="bo-list-item" style={{ background: 'var(--bg-card, #fff)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '12px', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="bo-list-content">
        <div className="bo-list-title" style={{ fontWeight: '700', color: 'var(--text-main, #1e293b)', fontSize: '1.2rem' }}>
          {title}
          {badge && <span style={{ marginLeft: '10px' }}>{badge}</span>}
        </div>
        {subtitle && (
          <div className="bo-list-desc" style={{ color: 'var(--text-sub, #64748b)', fontSize: '1rem', marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>

      <div className="bo-list-actions">
        {actions}
      </div>
    </div>
  );
}