import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { validatePassword } from '@/lib/validation';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { token, password } = (await request.json()) as { token: string; password: string };

    if (!token || !password) {
      return NextResponse.json({ error: 'Token e nova palavra-passe são obrigatórios.' }, { status: 400 });
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: `Palavra-passe fraca. ${validation.errors.join(', ')}` },
        { status: 400 }
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken) {
      return NextResponse.json({ error: 'Link de recuperação inválido.' }, { status: 400 });
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ error: 'O link de recuperação expirou. Solicite um novo.' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashed },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ message: 'Palavra-passe alterada com sucesso.' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
