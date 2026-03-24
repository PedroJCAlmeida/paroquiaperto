export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';

export async function GET(): Promise<NextResponse> {
  try {
    const horarios = await prisma.horario.findMany({
      include: { paroquia: { select: { id: true, nome: true } } },
    });
    return NextResponse.json(horarios);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { paroquiaId, diaSemana, hora, tipo } = (await request.json()) as {
      paroquiaId: string;
      diaSemana: string;
      hora: string;
      tipo: string;
    };
    const horario = await prisma.horario.create({
      data: {
        diaSemana,
        hora,
        tipo,
        paroquia: { connect: { id: parseInt(paroquiaId) } },
      },
    });
    return NextResponse.json(horario, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
