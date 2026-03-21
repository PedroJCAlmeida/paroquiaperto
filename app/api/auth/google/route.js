import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    const { token } = await request.json();

    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    if (!googleRes.ok) {
      return NextResponse.json({ error: 'Token Google inválido.' }, { status: 401 });
    }
    const googleData = await googleRes.json();
    const { email, name } = googleData;

    if (!email) {
      return NextResponse.json({ error: 'Não foi possível obter o email do Google.' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: name || email, email, password: '', authProvider: 'google' }
      });
    }

    const jwtToken = await signJWT({ sub: String(user.id), email: user.email, name: user.name });
    return NextResponse.json({ token: jwtToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
