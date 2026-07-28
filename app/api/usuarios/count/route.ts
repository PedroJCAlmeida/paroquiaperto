export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';
import { isAdminRole } from '@/lib/roles';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyJWT(token) : null;

    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    if (!isAdminRole(payload.role)) {
      return NextResponse.json({ error: 'Acesso proibido.' }, { status: 403 });
    }

    const count = await prisma.user.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
