export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const atletas = await prisma.atleta.findMany({
      include: { clube: true, escalao: true },
      orderBy: { nome: 'asc' },
    });
    return NextResponse.json(atletas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload || payload.role !== 'coordenador_futebol') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const data = await request.json();
    if (!data.nome || !data.clubeId) {
      return NextResponse.json({ error: 'O nome e o clube do atleta são obrigatórios.' }, { status: 400 });
    }

    const atleta = await prisma.atleta.create({
      data: {
        nome: data.nome,
        posicao: data.posicao || null,
        numero: data.numero ? parseInt(data.numero) : null,
        imagem: data.imagem || null,
        clubeId: parseInt(data.clubeId),
        escalaoId: data.escalaoId ? parseInt(data.escalaoId) : null,
      },
    });
    return NextResponse.json(atleta, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
