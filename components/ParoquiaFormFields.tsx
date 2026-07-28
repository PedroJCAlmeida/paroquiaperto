'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Conselho, Distrito } from '@/types';

const Mapa = dynamic(() => import('@/components/Mapa'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      A carregar mapa...
    </div>
  ),
});

export interface ParoquiaFormValues {
  nome: string;
  rua: string;
  numeroPorta: string;
  codigoPostal: string;
  localidade: string;
  distritoId: string;
  conselhoId: string;
  lat: string;
  lng: string;
  telefone: string;
  email: string;
  descricao: string;
  site: string;
  imagem: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
}

interface ParoquiaFormFieldsProps {
  values: ParoquiaFormValues;
  distritos: Distrito[];
  conselhos: Conselho[];
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onBuscarLocalizacao: () => void;
  onImagemChange: React.ChangeEventHandler<HTMLInputElement>;
  onMarkerDrag?: (lat: number, lng: number) => void;
  imagemPreview: string;
  uploadingImagem: boolean;
  footer?: React.ReactNode;
  locationHint?: string;
  imageLabel?: string;
}

export default function ParoquiaFormFields({
  values,
  distritos,
  conselhos,
  onChange,
  onBuscarLocalizacao,
  onImagemChange,
  onMarkerDrag,
  imagemPreview,
  uploadingImagem,
  footer,
  locationHint = '⚠ Clique em “Buscar localização” após preencher o endereço para obter as coordenadas.',
  imageLabel = 'Ficheiro de imagem',
}: ParoquiaFormFieldsProps) {
  return (
    <>
      <section className="bo-section" style={{ marginBottom: '1.5rem' }}>
        <h3>Dados Básicos</h3>
        <div className="bo-grid-2">
          <label style={{ gridColumn: '1 / -1' }}>
            Nome da Paróquia
            <input type="text" name="nome" value={values.nome} onChange={onChange} required />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            Descrição
            <textarea name="descricao" value={values.descricao} onChange={onChange} rows={4} />
          </label>
        </div>
      </section>

      <section className="bo-section" style={{ marginBottom: '1.5rem' }}>
        <h3 className="bo-h3-purple">Morada</h3>
        <div className="bo-grid-2">
          <label>
            Rua
            <input type="text" name="rua" value={values.rua} onChange={onChange} required />
          </label>
          <label>
            Número
            <input type="text" name="numeroPorta" value={values.numeroPorta} onChange={onChange} required />
          </label>
          <label>
            Código Postal
            <input type="text" name="codigoPostal" value={values.codigoPostal} onChange={onChange} required pattern="\d{4}-\d{3}" placeholder="1234-567" />
          </label>
          <label>
            Localidade
            <input type="text" name="localidade" value={values.localidade} onChange={onChange} required />
          </label>
          <label>
            Distrito
            <select
              name="distritoId"
              value={values.distritoId}
              onChange={onChange}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f8fafc' }}
            >
              <option value="">Selecione um distrito</option>
              {distritos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Conselho
            <select
              name="conselhoId"
              value={values.conselhoId}
              onChange={onChange}
              disabled={!values.distritoId}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', background: values.distritoId ? '#f8fafc' : '#f1f5f9' }}
            >
              <option value="">Selecione um conselho</option>
              {conselhos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="bo-section" style={{ marginBottom: '1.5rem' }}>
        <h3 className="bo-h3-amber">Localização</h3>
        <div className="bo-actions">
          <button type="button" className="bo-btn-secondary" onClick={onBuscarLocalizacao}>
            Buscar localização
          </button>
        </div>
        {values.lat && values.lng && (
          <div style={{ marginTop: '16px', marginBottom: '16px', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
            <Mapa
              coords={{ latitude: parseFloat(values.lat), longitude: parseFloat(values.lng) }}
              isEditable={Boolean(onMarkerDrag)}
              onMarkerDrag={
                onMarkerDrag
                  ? (newLat, newLng) => onMarkerDrag(newLat, newLng)
                  : undefined
              }
            />
            {onMarkerDrag && (
              <p style={{ fontSize: '0.8rem', color: '#64748b', padding: '8px', textAlign: 'center', background: '#f8fafc' }}>
                📍 Pode arrastar o marcador para ajustar a posição exata no mapa.
              </p>
            )}
          </div>
        )}
        <div className="bo-latlng">
          <label>
            Latitude
            <input type="text" name="lat" value={values.lat} readOnly placeholder="Preenchido automaticamente" style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
          </label>
          <label>
            Longitude
            <input type="text" name="lng" value={values.lng} readOnly placeholder="Preenchido automaticamente" style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
          </label>
        </div>
        {!values.lat && !values.lng && (
          <p style={{ color: '#f59e0b', fontSize: '0.88rem', marginTop: 6 }}>{locationHint}</p>
        )}
      </section>

      <section className="bo-section" style={{ marginBottom: '1.5rem' }}>
        <h3>Contactos &amp; Redes Sociais</h3>
        <div className="bo-grid-2">
          <label>
            Telefone
            <input type="text" name="telefone" value={values.telefone} onChange={onChange} />
          </label>
          <label>
            E-mail
            <input type="email" name="email" value={values.email} onChange={onChange} />
          </label>
          <label>
            Site
            <input type="url" name="site" value={values.site} onChange={onChange} />
          </label>
          <label>
            WhatsApp
            <input type="text" name="whatsapp" value={values.whatsapp} onChange={onChange} />
          </label>
          <label>
            Facebook
            <input type="url" name="facebook" value={values.facebook} onChange={onChange} />
          </label>
          <label>
            Instagram
            <input type="url" name="instagram" value={values.instagram} onChange={onChange} />
          </label>
        </div>
      </section>

      <section className="bo-section" style={{ marginBottom: '1.5rem' }}>
        <h3>Imagem</h3>
        <label>
          {imageLabel}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onImagemChange}
          />
          {imagemPreview && (
            <img
              src={imagemPreview}
              alt="Pré-visualização"
              style={{ marginTop: 8, maxWidth: '100%', maxHeight: 180, borderRadius: 8, objectFit: 'cover' }}
            />
          )}
          {uploadingImagem && <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>A fazer upload...</p>}
        </label>
      </section>

      {footer}
    </>
  );
}