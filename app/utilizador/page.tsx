"use client";
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import { FaCamera, FaTrash, FaUserCircle } from 'react-icons/fa';
import '@/styles/Backoffice.css';
import type { Paroquia, UserProfile } from '@/types';

interface UserForm {
	nome: string;
	email: string;
	paroquiaPreferida: string;
}

function Utilizador() {
	const [user, setUser] = useState<UserProfile>({ id: 0, name: '', email: '' });
	const [paroquias, setParoquias] = useState<Paroquia[]>([]);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState<UserForm>({ nome: '', email: '', paroquiaPreferida: '' });
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');
	const [uploadingImage, setUploadingImage] = useState(false);
	const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
	const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
		show: false,
		type: 'success',
		message: '',
	});
	const fileInputRef = useRef<HTMLInputElement>(null);
	const showToast = (message: string, type: 'success' | 'error' = 'success') => {
		setToast({ show: true, type, message });
	};
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			setLoading(false);
			return;
		}
		setLoading(true);
		Promise.all([
			fetch('/api/usuario', { headers: { Authorization: `Bearer ${token}` } }).then(async (res) => {
				if (!res.ok) throw new Error('Falha ao carregar perfil');
				return res.json();
			}),
			fetch('/api/paroquias').then(async (res) => {
				if (!res.ok) throw new Error('Falha ao carregar paróquias');
				return res.json();
			}),
		])
			.then(([userData, paroquiasData]: [UserProfile, Paroquia[]]) => {
				setUser(userData);
				setForm({ nome: userData.name ?? '', email: userData.email ?? '', paroquiaPreferida: '' });
				if (userData.image) setImagePreview(userData.image);
				setParoquias(paroquiasData);
				setLoading(false);
			})
			.catch((err) => {
				showToast(err instanceof Error ? err.message : 'Erro ao carregar dados.', 'error');
				setLoading(false);
			});
	}, []);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		if (file) {
			if (file.size > 4 * 1024 * 1024) {
				showToast('Imagem muito grande (máximo 4MB)', 'error');
				return;
			}
			if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
				showToast('Formato de imagem inválido', 'error');
				return;
			}
			setImageFile(file);
			setShouldRemoveImage(false);
			setImagePreview((prev) => {
				if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
				return URL.createObjectURL(file);
			});
		}
	};
	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview('');
		setShouldRemoveImage(true);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};
	const triggerFileInput = () => {
		if (editMode && !saving) {
			fileInputRef.current?.click();
		}
	};
	React.useEffect(() => {
		return () => {
			if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
		};
	}, [imagePreview]);
	const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSaving(true);
		const token = localStorage.getItem('token');
		try {
			let imageUrl: string | null | undefined = undefined;
			if (shouldRemoveImage) {
				imageUrl = null;
			} else if (imageFile) {
				setUploadingImage(true);
				const uploadData = new FormData();
				uploadData.append('file', imageFile);
				uploadData.append('folder', 'paroquiaperto/perfis');
				const uploadRes = await fetch('/api/upload', {
					method: 'POST',
					headers: { Authorization: `Bearer ${token}` },
					body: uploadData,
				});
				setUploadingImage(false);
				if (!uploadRes.ok) {
					const err = await uploadRes.json() as { error?: string };
					throw new Error(err.error ?? 'Erro ao fazer upload da imagem');
				}
				const { url } = await uploadRes.json() as { url: string };
				imageUrl = url;
			}
			const res = await fetch('/api/usuario', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ 
					name: form.nome, 
					email: form.email, 
					...(imageUrl !== undefined && { image: imageUrl }) 
				}),
			});
			if (!res.ok) {
				const err = await res.json() as { error?: string };
				throw new Error(err.error ?? 'Erro ao salvar dados');
			}
			const updated = (await res.json()) as UserProfile;
			setUser(updated);
			setForm({ nome: updated.name ?? '', email: updated.email ?? '', paroquiaPreferida: form.paroquiaPreferida });
			if (updated.image) {
				setImagePreview(updated.image);
			} else {
				setImagePreview('');
			}
			setImageFile(null);
			setShouldRemoveImage(false);
			showToast('Dados salvos com sucesso!');
			setEditMode(false);
		} catch (err) {
			showToast(err instanceof Error ? err.message : 'Erro ao salvar dados.', 'error');
		} finally {
			setSaving(false);
			setUploadingImage(false);
		}
	};
	const paroquiasFiltradas = paroquias.filter((p) =>
		(p.nome ?? '').toLowerCase().includes(search.toLowerCase()),
	);
	return (
		<>
			<Navbar />
			<div style={{ paddingTop: '64px' }}>
				<div className="backoffice-page">
					<h2 style={{ textAlign: 'center', color: '#243B55', fontWeight: 900, fontSize: '2rem', marginBottom: 18 }}>
						Área do Utilizador
					</h2>
					{loading ? (
						<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
							<div className="bo-spinner" style={{ width: 40, height: 40, borderTopColor: '#243B55' }}></div>
						</div>
					) : (
						<form className="backoffice-form" style={{ maxWidth: 450, margin: '0 auto' }} onSubmit={handleSave}>
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
								<div 
									onClick={triggerFileInput}
									style={{ 
										position: 'relative', 
										width: 100, 
										height: 100, 
										borderRadius: '50%', 
										cursor: editMode && !saving ? 'pointer' : 'default',
										overflow: 'hidden',
										border: '3px solid #cbd5e1',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										backgroundColor: '#f8fafc'
									}}
								>
									{imagePreview ? (
										<img
											src={imagePreview}
											alt="Foto de perfil"
											style={{ width: '100%', height: '100%', objectFit: 'cover' }}
										/>
									) : (
										<FaUserCircle size={100} color="#cbd5e1" />
									)}
									{editMode && !saving && (
										<div style={{ 
											position: 'absolute', 
											bottom: 0, 
											left: 0, 
											right: 0, 
											background: 'rgba(0,0,0,0.5)', 
											padding: '4px 0', 
											display: 'flex', 
											justifyContent: 'center',
											color: 'white'
										}}>
											<FaCamera size={14} />
										</div>
									)}
								</div>
								{editMode && (
									<div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
										<button 
											type="button"
											onClick={triggerFileInput}
											disabled={saving}
											style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: 4, background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
										>
											Alterar
										</button>
										{imagePreview && (
											<button 
												type="button" 
												onClick={handleRemoveImage}
												disabled={saving}
												style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: 4, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
											>
												<FaTrash size={10} /> Remover
											</button>
										)}
									</div>
								)}
								<input
									type="file"
									ref={fileInputRef}
									accept="image/jpeg,image/png,image/webp,image/gif"
									onChange={handleImageChange}
									style={{ display: 'none' }}
								/>
								{uploadingImage && <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 8 }}>A carregar imagem...</p>}
							</div>
							<label>
								Nome
								<input type="text" name="nome" value={form.nome} onChange={handleChange} disabled={!editMode || saving} />
							</label>
							<label>
								E-mail
								<input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editMode || saving} />
							</label>
							<label>
								Paróquia de preferência
								<input
									type="text"
									placeholder="Pesquisar paróquia..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									disabled={!editMode || saving}
									style={{ marginBottom: 8 }}
								/>
								<select
									name="paroquiaPreferida"
									value={form.paroquiaPreferida}
									onChange={handleChange}
									disabled={!editMode || saving}
								>
									<option value="">Selecione...</option>
									{paroquiasFiltradas.map((p) => (
										<option key={p.id} value={p.id}>
											{p.nome}
										</option>
									))}
								</select>
							</label>
							<div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
								{editMode ? (
									<>
										<button 
											type="submit" 
											className="bo-btn bo-btn-primary" 
											style={{ flex: 1 }} 
											disabled={saving || uploadingImage}
										>
											{saving || uploadingImage ? 'A guardar...' : 'Guardar Alterações'}
										</button>
										<button 
											type="button" 
											className="bo-btn bo-btn-light" 
											onClick={() => {
												setEditMode(false);
												setForm({ nome: user.name ?? '', email: user.email ?? '', paroquiaPreferida: '' });
												setImagePreview(user.image ?? '');
												setImageFile(null);
												setShouldRemoveImage(false);
											}}
											disabled={saving || uploadingImage}
										>
											Cancelar
										</button>
									</>
								) : (
									<button 
										type="button" 
										className="bo-btn bo-btn-primary" 
										style={{ width: '100%' }}
										onClick={() => setEditMode(true)}
									>
										Editar Perfil
									</button>
								)}
							</div>
						</form>
					)}
				</div>
			</div>
			<Toast 
				show={toast.show} 
				type={toast.type} 
				message={toast.message} 
				onClose={() => setToast({ ...toast, show: false })} 
			/>
			<Footer />
		</>
	);
}

export default Utilizador;