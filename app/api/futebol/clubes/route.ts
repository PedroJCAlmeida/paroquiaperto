export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';

export async function GET(): Promise<NextResponse> {
  try {
    const clubes = await prisma.clube.findMany({
      include: { escaloes: true },
      orderBy: { nome: 'asc' },
    });
    return NextResponse.json(clubes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload || payload.role !== 'coordenador_futebol') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const data = (await request.json()) as { nome?: string };
    if (!data.nome) {
      return NextResponse.json({ error: 'O nome do clube é obrigatório.' }, { status: 400 });
    }

    const clube = await prisma.clube.create({ data: { nome: data.nome } });
    return NextResponse.json(clube, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
