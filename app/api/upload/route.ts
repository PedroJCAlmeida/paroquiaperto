export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB (Limite de segurança)

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Verificação de Autenticação
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    // 2. Extração do Ficheiro
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'paroquiaperto/paroquias';

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro enviado.' }, { status: 400 });
    }

    // 3. Validações rápidas antes do upload
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Formato inválido.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Imagem muito grande (Máx 4MB).' }, { status: 400 });
    }

    // 4. Conversão para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Upload via Stream (Mais rápido e consome menos memória na Vercel)
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          // Opcional: Redimensionar no Cloudinary para poupar espaço e tempo
          transformation: [{ width: 1000, crop: "limit" }] 
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const uploadResult = result as any;

    return NextResponse.json(
      { url: uploadResult.secure_url }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no upload' }, 
      { status: 500 }
    );
  }
}
