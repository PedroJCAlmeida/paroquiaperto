import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const [distritos, conselhos, paroquias] = await Promise.all([
    prisma.distrito.findMany(),
    prisma.conselho.findMany(),
    prisma.paroquia.findMany({ take: 5 })
  ]);
  console.log(JSON.stringify({ distritos, conselhos, paroquias }, null, 2));
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
