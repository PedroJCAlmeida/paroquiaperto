import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?verified=missing-token', request.url));
  }

  try {
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL('/login?verified=invalid-token', request.url));
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({ where: { token } });
      return NextResponse.redirect(new URL('/login?verified=expired-token', request.url));
    }

    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });

    await prisma.emailVerificationToken.deleteMany({ where: { userId: verificationToken.userId } });

    return NextResponse.redirect(new URL('/login?verified=success', request.url));
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/login?verified=error', request.url));
  }
}
