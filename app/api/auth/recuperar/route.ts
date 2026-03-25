import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email } = (await request.json()) as { email: string };

    if (!email) {
      return NextResponse.json({ error: 'E-mail obrigatório.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid user enumeration attacks.
    if (!user) {
      return NextResponse.json({ message: 'Se o e-mail existir, receberá um link de recuperação.' });
    }

    // Delete any existing token for this user so there is only one active at a time.
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    const configuredUrl = process.env.APP_URL;
    if (!configuredUrl) {
      console.warn('APP_URL is not set. Falling back to request origin for password reset link. Set APP_URL in production.');
    }
    const baseUrl = configuredUrl ?? new URL(request.url).origin;
    const resetUrl = `${baseUrl}/recuperar-palavra-passe/redefinir?token=${token}`;

    await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({ message: 'Se o e-mail existir, receberá um link de recuperação.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
