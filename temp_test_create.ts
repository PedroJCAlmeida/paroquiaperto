import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const paroquia = await prisma.paroquia.create({
    data: {
      nome: "Paróquia de Teste",
      endereco: "Rua de Teste, 123",
      lat: "41.142517",
      lng: "-8.61104",
      imagem: "https://res.cloudinary.com/test/image/upload/v12345678/test.jpg",
      distritoId: 1,
      conselhoId: 1
    }
  });
  console.log("Created paróquia:", paroquia);
  // Cleanup
  await prisma.paroquia.delete({ where: { id: paroquia.id } });
  console.log("Deleted paróquia.");
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
