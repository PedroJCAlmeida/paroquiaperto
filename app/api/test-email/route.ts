import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Adicione ?email=seu-email@exemplo.com ao URL' }, { status: 400 });
  }

  try {
    // Simulando um link de teste
    const testUrl = 'https://paroquiaperto.vercel.app/teste-de-conexao';
    await sendPasswordResetEmail(email, testUrl);
    
    return NextResponse.json({ 
      success: true, 
      message: `E-mail de teste enviado para ${email}. Verifique a sua caixa de entrada (e o SPAM).` 
    });
  } catch (error: any) {
    console.error('Erro no teste de e-mail:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro desconhecido ao enviar e-mail.' 
    }, { status: 500 });
  }
}
