export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
