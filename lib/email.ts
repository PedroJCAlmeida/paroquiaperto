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
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://paroquiaperto.pt/logo.png" alt="Paróquia Perto" style="max-width: 150px; height: auto;" />
          </div>
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
          <div style="text-align: center; margin-bottom: 16px;">
            <p style="color: #64748b; font-size: 0.85rem; margin: 8px 0;">Siga-nos nas redes sociais:</p>
            <div style="display: flex; justify-content: center; gap: 16px; margin: 12px 0;">
              <a href="https://facebook.com/paroquiaperto" style="color: #1877f2; text-decoration: none; font-size: 14px;">Facebook</a>
              <a href="https://instagram.com/paroquiaperto" style="color: #e4405f; text-decoration: none; font-size: 14px;">Instagram</a>
              <a href="https://youtube.com/@paroquiaperto" style="color: #ff0000; text-decoration: none; font-size: 14px;">YouTube</a>
            </div>
          </div>
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

export async function sendAccountVerificationEmail(to: string, verificationUrl: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    console.error('Erro: BREVO_API_KEY ou BREVO_SENDER_EMAIL não configurados.');
    throw new Error('Configuração de e-mail incompleta.');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: 'Paróquia Perto' },
      to: [{ email: to }],
      subject: 'Confirme a sua conta – Paróquia Perto',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://paroquiaperto.pt/logo.png" alt="Paróquia Perto" style="max-width: 150px; height: auto;" />
          </div>
          <h2 style="color: #2563eb;">Confirmação de Conta</h2>
          <p>Obrigado por se registar no <strong>Paróquia Perto</strong>.</p>
          <p>Para ativar a sua conta, clique no botão abaixo. Este link é válido por <strong>24 horas</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationUrl}"
               style="background: linear-gradient(90deg,#2563eb 60%,#7c3aed 100%); color: #fff;
                      padding: 14px 32px; border-radius: 10px; text-decoration: none;
                      font-weight: 600; font-size: 1rem; display: inline-block;">
              Confirmar Conta
            </a>
          </div>
          <p style="color: #64748b; font-size: 0.9rem;">
            Se não criou esta conta, pode ignorar este e-mail.<br>
            O link expira ao fim de 24 horas.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <div style="text-align: center; margin-bottom: 16px;">
            <p style="color: #64748b; font-size: 0.85rem; margin: 8px 0;">Siga-nos nas redes sociais:</p>
            <div style="display: flex; justify-content: center; gap: 16px; margin: 12px 0;">
              <a href="https://facebook.com/paroquiaperto" style="color: #1877f2; text-decoration: none; font-size: 14px;">Facebook</a>
              <a href="https://instagram.com/paroquiaperto" style="color: #e4405f; text-decoration: none; font-size: 14px;">Instagram</a>
              <a href="https://youtube.com/@paroquiaperto" style="color: #ff0000; text-decoration: none; font-size: 14px;">YouTube</a>
            </div>
          </div>
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
