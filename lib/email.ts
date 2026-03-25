export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    console.error('Erro: BREVO_API_KEY ou BREVO_SENDER_EMAIL não configurados.');
    throw new Error('Configuração de e-mail incompleta.');
  }

  const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';

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
            <img src="${baseUrl}/logo_paroquia.png" alt="Paróquia Perto" style="max-width: 120px; height: auto;" />
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
          <div style="text-align: center; padding: 24px 20px;">
            <p style="color: #5E5244; font-size: 0.85rem; margin: 0 0 16px 0;">Siga-nos nas redes sociais:</p>
            <div>
              <a href="https://facebook.com/paroquiaperto" target="_blank" aria-label="Facebook" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24" aria-hidden="true" style="fill: #1F2F46; vertical-align: middle;">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
              </a>
              <a href="https://instagram.com/paroquiaperto" target="_blank" aria-label="Instagram" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24" aria-hidden="true" style="fill: #1F2F46; vertical-align: middle;">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                </svg>
              </a>
              <a href="https://wa.me/351911837861" target="_blank" aria-label="WhatsApp" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24" aria-hidden="true" style="fill: #1F2F46; vertical-align: middle;">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </a>
            </div>
            <p style="color: #7F6F5B; font-size: 0.8rem; margin: 16px 0 0 0;">© Paróquia Perto</p>
          </div>
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

  const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';

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
            <img src="${baseUrl}/logo_paroquia.png" alt="Paróquia Perto" style="max-width: 120px; height: auto;" />
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
          <div style="text-align: center; padding: 24px 20px;">
            <p style="color: #5E5244; font-size: 0.85rem; margin: 0 0 16px 0;">Siga-nos nas redes sociais:</p>
            <div>
              <a href="https://facebook.com/paroquiaperto" target="_blank" aria-label="Facebook" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24" aria-hidden="true" style="fill: #1F2F46; vertical-align: middle;">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
              </a>
              <a href="https://instagram.com/paroquiaperto" target="_blank" aria-label="Instagram" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24" aria-hidden="true" style="fill: #1F2F46; vertical-align: middle;">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                </svg>
              </a>
              <a href="https://wa.me/351911837861" target="_blank" aria-label="WhatsApp" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24" aria-hidden="true" style="fill: #1F2F46; vertical-align: middle;">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </a>
            </div>
            <p style="color: #7F6F5B; font-size: 0.8rem; margin: 16px 0 0 0;">© Paróquia Perto</p>
          </div>
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
