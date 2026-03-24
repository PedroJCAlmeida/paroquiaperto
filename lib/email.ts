import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS) are required.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Paróquia Perto" <${from}>`,
    to,
    subject: 'Recuperação de Palavra-Passe – Paróquia Perto',
    html: `
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
    text: `Recuperação de Palavra-Passe\n\nClique no seguinte link para redefinir a sua palavra-passe:\n${resetUrl}\n\nO link expira em 1 hora.\n\nSe não solicitou este pedido, ignore este e-mail.`,
  });
}
