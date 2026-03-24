export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';

export async function GET(): Promise<NextResponse> {
  try {
    const escaloes = await prisma.escalao.findMany({
      include: {
        clube: true,
        treinador: { select: { id: true, name: true, email: true } },
        delegado: { select: { id: true, name: true, email: true } },
        auxiliar: { select: { id: true, name: true, email: true } },
      },
      orderBy: { nome: 'asc' },
    });
    return NextResponse.json(escaloes);
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

    const data = (await request.json()) as {
      nome?: string;
      clubeId?: string;
      treinadorId?: string | null;
      delegadoId?: string | null;
      auxiliarId?: string | null;
    };
    if (!data.nome || !data.clubeId) {
      return NextResponse.json({ error: 'Nome e clube são obrigatórios.' }, { status: 400 });
    }

    const escalao = await prisma.escalao.create({
      data: {
        nome: data.nome,
        clube: { connect: { id: parseInt(data.clubeId) } },
        ...(data.treinadorId && { treinador: { connect: { id: parseInt(data.treinadorId) } } }),
        ...(data.delegadoId && { delegado: { connect: { id: parseInt(data.delegadoId) } } }),
        ...(data.auxiliarId && { auxiliar: { connect: { id: parseInt(data.auxiliarId) } } }),
      },
      include: {
        clube: true,
        treinador: { select: { id: true, name: true, email: true } },
        delegado: { select: { id: true, name: true, email: true } },
        auxiliar: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json(escalao, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
