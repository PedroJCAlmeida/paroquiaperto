export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const paroquia = await prisma.paroquia.findUnique({
      where: { id: parseInt(id) },
      include: { distrito: true, conselho: true, horarios: true, eventos: true },
    });
    if (!paroquia) {
      return NextResponse.json({ error: 'Paróquia não encontrada.' }, { status: 404 });
    }
    return NextResponse.json(paroquia);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const data = (await request.json()) as Record<string, unknown>;
    const paroquia = await prisma.paroquia.update({
      where: { id: parseInt(id) },
      data: {
        nome: data.nome as string,
        endereco: data.endereco as string,
        lat: data.lat != null && data.lat !== '' ? String(data.lat) : undefined,
        lng: data.lng != null && data.lng !== '' ? String(data.lng) : undefined,
        telefone: (data.telefone as string) || null,
        email: (data.email as string) || null,
        site: (data.site as string) || null,
        imagem: (data.imagem as string) || null,
        facebook: (data.facebook as string) || null,
        instagram: (data.instagram as string) || null,
        whatsapp: (data.whatsapp as string) || null,
        descricao: (data.descricao as string) || null,
      },
      include: { distrito: true, conselho: true },
    });
    return NextResponse.json(paroquia);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    
    await prisma.paroquia.delete({ 
      where: { id: parseInt(id) } 
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);

    // Erro P2003: Falha na restrição de chave estrangeira (Foreign key constraint)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Não é possível remover esta paróquia porque ela possui horários ou eventos associados. Remova-os primeiro.' }, 
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Erro interno ao tentar remover.' }, { status: 500 });
  }
}
