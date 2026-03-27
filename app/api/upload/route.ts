export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'Nenhum ficheiro enviado.' }, { status: 400 });

    // Validação de tipo e tamanho
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de ficheiro não suportado. Use JPEG, PNG, WEBP ou GIF.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Ficheiro demasiado grande. Máximo 4MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload usando Base64 (mais estável que streams em Next.js)
    const base64Image = `data:${file.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
    const folder = (formData.get('folder') as string) || 'paroquiaperto';

    console.log(`[UPLOAD] Tentando upload para: ${cloudinary.config().cloud_name}`);

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'auto',
    });

    return NextResponse.json({ url: result.secure_url }, { status: 201 });
  } catch (error: any) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json({ error: error.message || 'Erro no upload' }, { status: 500 });
  }
}
