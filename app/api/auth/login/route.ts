import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signJWT } from '@/lib/auth';
import { normalizeRole } from '@/lib/roles';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e palavra-passe são obrigatórios.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json(
        { error: 'Esta conta utiliza autenticação Google. Por favor, inicie sessão com o Google.' },
        { status: 401 },
      );
    }

    if (user.authProvider === 'local' && !user.emailVerified) {
      return NextResponse.json(
        { error: 'Conta ainda não verificada. Verifique o seu e-mail para ativar a conta.' },
        { status: 403 },
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Palavra-passe incorreta.' }, { status: 401 });
    }

    const normalizedRole = normalizeRole(user.role);
    const token = await signJWT({ sub: String(user.id), email: user.email, name: user.name, role: normalizedRole });
    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, role: normalizedRole } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
