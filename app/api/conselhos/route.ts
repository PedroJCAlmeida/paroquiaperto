export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const distritoId = searchParams.get('distritoId');

    const conselhos = await prisma.conselho.findMany({
      where: distritoId ? { distritoId: parseInt(distritoId) } : undefined,
      orderBy: { nome: 'asc' },
    });
    return NextResponse.json(conselhos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
