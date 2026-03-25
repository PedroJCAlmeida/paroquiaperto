import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendAccountVerificationEmail } from '@/lib/email';
import { validatePassword } from '@/lib/validation';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { name, email, password } = (await request.json()) as { name: string; email: string; password: string };

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 });
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: `Palavra-passe fraca. ${validation.errors.join(', ')}` },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email já registado.' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    const configuredUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;
    if (!configuredUrl) {
      console.warn('APP_URL is not set. Falling back to request origin for verification link. Set APP_URL in production.');
    }
    const baseUrl = configuredUrl ?? new URL(request.url).origin;
    const verificationUrl = `${baseUrl}/api/auth/confirmar?token=${token}`;

    await sendAccountVerificationEmail(email, verificationUrl);

    return NextResponse.json({
      message: 'Conta criada com sucesso. Verifique o seu e-mail para ativar a conta.',
      requiresEmailVerification: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
