export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

function inferMimeTypeFromName(fileName: string): string | null {
  const name = fileName.toLowerCase();
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.webp')) return 'image/webp';
  if (name.endsWith('.gif')) return 'image/gif';
  return null;
}

function getCloudinaryConfigError(): string | null {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return 'CLOUDINARY_CLOUD_NAME em falta.';
  if (!process.env.CLOUDINARY_API_KEY) return 'CLOUDINARY_API_KEY em falta.';
  if (!process.env.CLOUDINARY_API_SECRET) return 'CLOUDINARY_API_SECRET em falta.';
  return null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file !== 'object' || !('arrayBuffer' in file)) {
      return NextResponse.json({ error: 'Nenhum ficheiro enviado.' }, { status: 400 });
    }

    const inputFile = file as File;
    const mimeType = inputFile.type || inferMimeTypeFromName(inputFile.name) || '';

    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: 'Tipo de ficheiro não permitido. Use JPEG, PNG, WebP ou GIF.' }, { status: 400 });
    }

    if (inputFile.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'O ficheiro é demasiado grande. Máximo 4 MB.' }, { status: 400 });
    }

    const folder = (formData.get('folder') as string) || 'paroquiaperto';
    const cloudinaryConfigError = getCloudinaryConfigError();
    if (cloudinaryConfigError) {
      return NextResponse.json({ error: `Configuração de upload incompleta: ${cloudinaryConfigError}` }, { status: 500 });
    }

    const arrayBuffer = await inputFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;
    
    console.log(`[UPLOAD] Iniciando via Base64: pasta=${folder}, tipo=${mimeType}`);

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'auto',
    });

    if (!uploadResult?.secure_url) {
      console.error('[UPLOAD] Erro: Cloudinary não retornou URL.', uploadResult);
      throw new Error('Cloudinary não retornou URL segura.');
    }

    console.log('[UPLOAD] Sucesso:', uploadResult.secure_url);
    return NextResponse.json({ url: uploadResult.secure_url }, { status: 201 });
  } catch (error) {
    let message = 'Erro ao fazer upload da imagem.';
    if (error && typeof error === 'object') {
      if ('message' in error && typeof error.message === 'string') {
        message = error.message;
      } else if ('error' in error && typeof error.error === 'string') {
        message = error.error;
      } else if (error instanceof Error) {
        message = error.message;
      } else {
        try {
          message = JSON.stringify(error);
        } catch {}
      }
    }
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
