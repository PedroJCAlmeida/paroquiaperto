export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      include: { paroquia: { select: { id: true, nome: true } } }
    });
    return NextResponse.json(eventos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { paroquiaId, titulo, data, hora, descricao, imagem } = await request.json();
    const evento = await prisma.evento.create({
      data: {
        titulo,
        data,
        hora,
        descricao: descricao || null,
        imagem: imagem || null,
        paroquia: { connect: { id: parseInt(paroquiaId) } }
      }
    });
    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
