import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  // 1. Criar Utilizador Admin
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@paroquiaperto.pt';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin123!';
  const adminName = process.env.ADMIN_NAME ?? 'Administrador';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashed,
        role: 'admin',
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
    console.log(`Seed: Admin user created (${adminEmail})`);
  }

  // 2. Importar Paróquias do JSON
  const jsonPath = path.join(process.cwd(), 'public', 'paroquias.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Seed: Importing ${data.length} paróquias...`);

    // Criar um Distrito e Conselho padrão (Porto) para os dados do JSON que não têm esta info
    const distrito = await prisma.distrito.upsert({
      where: { nome: 'Porto' },
      update: {},
      create: { nome: 'Porto' },
    });

    const conselho = await prisma.conselho.create({
      data: {
        nome: 'Porto',
        distritoId: distrito.id,
      },
    });

    for (const p of data) {
      const paroquia = await prisma.paroquia.create({
        data: {
          nome: p.nome,
          endereco: p.endereco,
          lat: String(p.lat),
          lng: String(p.lng),
          descricao: p.descricao,
          telefone: p.contato,
          email: p.email,
          site: p.site,
          imagem: p.imagem,
          instagram: p.instagram,
          facebook: p.facebook,
          whatsapp: p.whatsapp,
          distritoId: distrito.id,
          conselhoId: conselho.id,
        },
      });

      // Importar Horários
      if (p.horarios && Array.isArray(p.horarios)) {
        for (const hText of p.horarios) {
          // Tentar separar o dia da hora (ex: "(seg-sex) 12h00 - 13h00")
          const parts = hText.split(')');
          const diaSemana = parts[0]?.replace('(', '') || 'Geral';
          const horaETipo = parts[1]?.trim() || hText;

          await prisma.horario.create({
            data: {
              diaSemana,
              hora: horaETipo,
              tipo: 'Eucaristia', // Valor padrão
              paroquiaId: paroquia.id,
            },
          });
        }
      }
    }
    console.log('Seed: Data import completed!');
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
