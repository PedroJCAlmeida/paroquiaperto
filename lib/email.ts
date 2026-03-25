import fs from 'fs';
import path from 'path';

let cachedLogoDataUri: string | null = null;

function getEmailLogoDataUri(): string {
  if (cachedLogoDataUri !== null) return cachedLogoDataUri;
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo_paroquia.png');
    const logoData = fs.readFileSync(logoPath);
    cachedLogoDataUri = `data:image/png;base64,${logoData.toString('base64')}`;
    return cachedLogoDataUri;
  } catch (err) {
    console.error('Erro ao carregar logo do email:', err);
    return '';
  }
}

const socialLinksFooter = `
  <div style="text-align: center; padding: 24px 20px;">
    <p style="color: #5E5244; font-size: 0.85rem; margin: 0 0 16px 0;">Siga-nos nas redes sociais:</p>
    <div>
      <a href="https://facebook.com/paroquiaperto" target="_blank" style="display: inline-block; margin: 0 6px; background-color: #1F2F46; color: #ffffff; text-decoration: none; padding: 8px 14px; border-radius: 4px; font-size: 0.8rem; font-family: Arial, sans-serif;">Facebook</a>
      <a href="https://instagram.com/paroquiaperto" target="_blank" style="display: inline-block; margin: 0 6px; background-color: #1F2F46; color: #ffffff; text-decoration: none; padding: 8px 14px; border-radius: 4px; font-size: 0.8rem; font-family: Arial, sans-serif;">Instagram</a>
      <a href="https://wa.me/351911837861" target="_blank" style="display: inline-block; margin: 0 6px; background-color: #1F2F46; color: #ffffff; text-decoration: none; padding: 8px 14px; border-radius: 4px; font-size: 0.8rem; font-family: Arial, sans-serif;">WhatsApp</a>
    </div>
    <p style="color: #7F6F5B; font-size: 0.8rem; margin: 16px 0 0 0;">© Paróquia Perto</p>
  </div>
`;

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    console.error('Erro: BREVO_API_KEY ou BREVO_SENDER_EMAIL não configurados.');
    throw new Error('Configuração de e-mail incompleta.');
  }

  const logoDataUri = getEmailLogoDataUri();

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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F4; border: 1px solid #E3DBCF; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #1F2F46; text-align: center; padding: 28px 20px;">
            <img src="${logoDataUri}" alt="Paróquia Perto" style="max-width: 120px; height: auto;" />
          </div>
          <div style="padding: 32px 36px;">
            <h2 style="color: #1F2F46; margin-top: 0;">Recuperação de Palavra-Passe</h2>
            <p style="color: #433A30; line-height: 1.6;">Recebemos um pedido para redefinir a sua palavra-passe no <strong>Paróquia Perto</strong>.</p>
            <p style="color: #433A30; line-height: 1.6;">Clique no botão abaixo para criar uma nova palavra-passe. Este link é válido por <strong>1 hora</strong>.</p>
            <div style="text-align: center; margin: 36px 0;">
              <a href="${resetUrl}"
                 style="background-color: #9C7A46; color: #ffffff;
                        padding: 14px 36px; border-radius: 8px; text-decoration: none;
                        font-weight: 600; font-size: 1rem; display: inline-block; letter-spacing: 0.5px;">
                Redefinir Palavra-Passe
              </a>
            </div>
            <p style="color: #5E5244; font-size: 0.875rem; line-height: 1.5;">
              Se não solicitou este pedido, pode ignorar este e-mail.<br>
              O link expira ao fim de 1 hora.
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #E3DBCF; margin: 0 36px;" />
          ${socialLinksFooter}
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

  const logoDataUri = getEmailLogoDataUri();

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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F4; border: 1px solid #E3DBCF; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #1F2F46; text-align: center; padding: 28px 20px;">
            <img src="${logoDataUri}" alt="Paróquia Perto" style="max-width: 120px; height: auto;" />
          </div>
          <div style="padding: 32px 36px;">
            <h2 style="color: #1F2F46; margin-top: 0;">Confirmação de Conta</h2>
            <p style="color: #433A30; line-height: 1.6;">Obrigado por se registar no <strong>Paróquia Perto</strong>.</p>
            <p style="color: #433A30; line-height: 1.6;">Para ativar a sua conta, clique no botão abaixo. Este link é válido por <strong>24 horas</strong>.</p>
            <div style="text-align: center; margin: 36px 0;">
              <a href="${verificationUrl}"
                 style="background-color: #9C7A46; color: #ffffff;
                        padding: 14px 36px; border-radius: 8px; text-decoration: none;
                        font-weight: 600; font-size: 1rem; display: inline-block; letter-spacing: 0.5px;">
                Confirmar Conta
              </a>
            </div>
            <p style="color: #5E5244; font-size: 0.875rem; line-height: 1.5;">
              Se não criou esta conta, pode ignorar este e-mail.<br>
              O link expira ao fim de 24 horas.
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #E3DBCF; margin: 0 36px;" />
          ${socialLinksFooter}
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
