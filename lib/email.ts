export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    console.error('Erro: BREVO_API_KEY ou BREVO_SENDER_EMAIL não configurados.');
    throw new Error('Configuração de e-mail incompleta.');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: 'Paróquia Perto' },
      to: [{ email: to }],
      subject: 'Recuperação de Palavra-Passe – Paróquia Perto',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Recuperação de Palavra-Passe</h2>
          <p>Recebemos um pedido para redefinir a sua palavra-passe no <strong>Paróquia Perto</strong>.</p>
          <p>Clique no botão abaixo para criar uma nova palavra-passe. Este link é válido por <strong>1 hora</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}"
               style="background: linear-gradient(90deg,#2563eb 60%,#7c3aed 100%); color: #fff;
                      padding: 14px 32px; border-radius: 10px; text-decoration: none;
                      font-weight: 600; font-size: 1rem; display: inline-block;">
              Redefinir Palavra-Passe
            </a>
          </div>
          <p style="color: #64748b; font-size: 0.9rem;">
            Se não solicitou este pedido, pode ignorar este e-mail.<br>
            O link expira ao fim de 1 hora.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 0.8rem; text-align: center;">Paróquia Perto</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erro Brevo API:', errorData);
    throw new Error('Falha ao enviar e-mail via Brevo API.');
  }
}
