export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, getTokenFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest): Promise<NextResponse> {
	try {
		const token = getTokenFromRequest(request);
		const payload = token ? await verifyJWT(token) : null;
		if (!payload) {
			return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
		}

		const usuarios = await prisma.user.findMany({
			select: { id: true, name: true, email: true, role: true },
			orderBy: { name: 'asc' },
		});
		return NextResponse.json(usuarios);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
	}
}