import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const successMessage = 'Enviámos o link de recuperação para o seu e-mail.';

  try {
    const { email } = (await request.json()) as { email: string };

    if (!email) {
      return NextResponse.json({ error: 'E-mail obrigatório.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json({ error: 'Não existe nenhuma conta com este e-mail.' }, { status: 404 });
    }

    // Delete any existing token for this user so there is only one active at a time.
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    const configuredUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;
    if (!configuredUrl) {
      console.warn('APP_URL/NEXT_PUBLIC_APP_URL is not set. Falling back to request origin for password reset link. Set APP_URL in production.');
    }
    const baseUrl = configuredUrl ?? new URL(request.url).origin;
    const resetUrl = `${baseUrl}/recuperar-palavra-passe/redefinir?token=${token}`;

    try {
      await sendPasswordResetEmail(normalizedEmail, resetUrl);
    } catch (emailError) {
      console.error('Password reset email send error:', emailError);

      if (process.env.NODE_ENV !== 'production') {
        const detail = emailError instanceof Error ? emailError.message : 'Falha desconhecida no envio de e-mail.';
        return NextResponse.json(
          { error: `Falha no envio do e-mail de recuperação. ${detail}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: successMessage });
  } catch (error) {
    console.error('Password reset request error:', error);

    if (process.env.NODE_ENV !== 'production') {
      const detail = error instanceof Error ? error.message : 'Erro interno desconhecido.';
      return NextResponse.json({ error: `Erro interno do servidor. ${detail}` }, { status: 500 });
    }

    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
