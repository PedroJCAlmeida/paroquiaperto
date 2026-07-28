'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SuccessModal from '@/components/SuccessModal';
import AlertModal from '@/components/AlertModal';
import Toast from '@/components/Toast';
import ParoquiaFormFields, { type ParoquiaFormValues } from '@/components/ParoquiaFormFields';
import '@/styles/Backoffice.css';
import type { Distrito, Conselho } from '@/types';

interface NominatimResult {
  lat: string;
  lon: string;
}

export default function InserirParoquia() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'error' | 'warning' | 'info'>('error');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const [uploadingImagem, setUploadingImagem] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const initialForm: ParoquiaFormValues = {
    nome: '', rua: '', numeroPorta: '', codigoPostal: '', localidade: '',
    distritoId: '', conselhoId: '', lat: '', lng: '', telefone: '',
    email: '', descricao: '', site: '', imagem: '', facebook: '',
    instagram: '', whatsapp: '',
  };
  const [form, setForm] = useState<ParoquiaFormValues>(initialForm);
  
  useEffect(() => {
    fetch('/api/distritos')
      .then((res) => res.json())
      .then((data: Distrito[]) => setDistritos(Array.isArray(data) ? data : []))
      .catch(() => setDistritos([]));
  }, []);

  useEffect(() => {
    if (!form.distritoId) {
      setConselhos([]);
      return;
    }
    fetch(`/api/conselhos?distritoId=${form.distritoId}`)
      .then((res) => res.json())
      .then((data: Conselho[]) => setConselhos(Array.isArray(data) ? data : []))
      .catch(() => setConselhos([]));
  }, [form.distritoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'distritoId' ? { conselhoId: '' } : {}),
    }));
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagemFile(file);
    setImagemPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : '';
    });
  };

  React.useEffect(() => {
    return () => {
      if (imagemPreview) URL.revokeObjectURL(imagemPreview);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlertModal = (type: 'error' | 'warning' | 'info', title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleClearForm = () => {
    setForm(initialForm);
    setImagemFile(null);
    setImagemPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });
    setUploadingImagem(false);
  };

  const buscarLocalizacao = async () => {
    if (!form.rua || !form.numeroPorta || !form.codigoPostal || !form.localidade) {
      showAlertModal('warning', 'Campos incompletos', 'Preencha todos os campos de endereço para buscar localização.');
      return;
    }
    const enderecoCompleto = `${form.rua}, ${form.numeroPorta}, ${form.codigoPostal} ${form.localidade}`;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`;
      const response = await fetch(url);
      const data = (await response.json()) as NominatimResult[];
      if (data?.length > 0) {
        setForm((prev) => ({ ...prev, lat: data[0].lat, lng: data[0].lon }));
        showAlertModal('info', 'Localização encontrada', 'Coordenadas preenchidas com sucesso.');
      } else {
        showAlertModal('warning', 'Endereço não encontrado', 'Tente um endereço mais genérico ou verifique os dados informados.');
      }
    } catch (err) {
      console.error('Geolocation error:', err);
      showAlertModal('error', 'Erro na localização', 'Não foi possível buscar a localização. Verifique o endereço digitado.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.lat || !form.lng) {
      showAlertModal('warning', 'Localização não confirmada', 'Clique em "Buscar localização" para obter as coordenadas antes de guardar.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');

      let imagemUrl = form.imagem;
      if (imagemFile) {
        setUploadingImagem(true);
        const uploadData = new FormData();
        uploadData.append('file', imagemFile);
        uploadData.append('folder', 'paroquiaperto/paroquias');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });
        setUploadingImagem(false);
        if (!uploadRes.ok) {
          let errorMsg = 'Erro ao fazer upload da imagem.';
          try {
            const err = await uploadRes.json() as { error?: string };
            errorMsg = err.error ?? `Erro ${uploadRes.status}`;
          } catch (e) {
            errorMsg = `Erro ${uploadRes.status}: ${uploadRes.statusText}`;
          }
          showAlertModal('error', 'Erro no upload', errorMsg);
          return;
        }
        const { url } = await uploadRes.json() as { url: string };
        imagemUrl = url;
      }

      const payload = {
        nome: form.nome,
        lat: form.lat,
        lng: form.lng,
        telefone: form.telefone,
        email: form.email,
        descricao: form.descricao,
        site: form.site,
        imagem: imagemUrl,
        facebook: form.facebook,
        instagram: form.instagram,
        whatsapp: form.whatsapp,
        ...(form.distritoId ? { distritoId: parseInt(form.distritoId, 10) } : {}),
        ...(form.conselhoId ? { conselhoId: parseInt(form.conselhoId, 10) } : {}),
        numeroPorta: form.numeroPorta,
        localidade: form.localidade,
      };
      const response = await fetch('/api/paroquias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.replace('/login');
          setSubmitting(false);
          return;
        }
        let errorMsg = `Erro ${response.status}`;
        try {
          const errorData = await response.json() as { error?: string };
          errorMsg = errorData.error ?? errorMsg;
        } catch (e) {
          const errorText = await response.text();
          errorMsg = errorText || errorMsg;
        }
        showAlertModal('error', 'Erro ao enviar paróquia', errorMsg);
        return;
      }
      await response.json();
      handleClearForm();
      setShowModal(true);
      setShowToast(true);
    } catch (error) {
      console.error('Submit error:', error);
      showAlertModal('error', 'Erro ao enviar', (error instanceof Error ? error.message : 'Ocorreu um erro inesperado'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="backoffice-page">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Inserir Paróquia</h2>
        <p style={{ color: '#64748b', marginTop: '0.4rem' }}>Preencha os dados por secções para facilitar a validação e a localização.</p>
      </div>
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} title="Obrigado pela colaboração!" message="Sua paróquia foi enviada com sucesso." />
      <AlertModal show={showAlert} type={alertType} title={alertTitle} message={alertMessage} onClose={() => setShowAlert(false)} />
      <Toast show={showToast} type="success" message="Paróquia enviada com sucesso!" onClose={() => setShowToast(false)} />
      <form className="backoffice-form" onSubmit={handleSubmit}>
        <ParoquiaFormFields
          values={form}
          distritos={distritos}
          conselhos={conselhos}
          onChange={handleChange}
          onBuscarLocalizacao={buscarLocalizacao}
          onImagemChange={handleImagemChange}
          onMarkerDrag={(newLat, newLng) => setForm((prev) => ({ ...prev, lat: newLat.toFixed(7), lng: newLng.toFixed(7) }))}
          imagemPreview={imagemPreview}
          uploadingImagem={uploadingImagem}
          footer={(
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button type="button" className="bo-btn-secondary" onClick={handleClearForm} disabled={uploadingImagem || submitting}>
                Limpar
              </button>
              <button type="submit" disabled={uploadingImagem || submitting}>
                {(uploadingImagem || submitting) && <span className="bo-spinner" aria-hidden="true" />}
                {uploadingImagem ? 'A fazer upload...' : submitting ? 'A enviar paróquia...' : 'Guardar paróquia'}
              </button>
            </div>
          )}
        />
      </form>
    </div>
  );
}
