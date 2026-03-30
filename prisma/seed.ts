import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Dados geográficos de Portugal
const geoData = [
  { distrito: "Aveiro", concelhos: ["Águeda", "Albergaria-a-Velha", "Anadia", "Arouca", "Aveiro", "Castelo de Paiva", "Espinho", "Estarreja", "Ílhavo", "Mealhada", "Murtosa", "Oliveira de Azeméis", "Oliveira do Bairro", "Ovar", "Santa Maria da Feira", "São João da Madeira", "Sever do Vouga", "Vagos", "Vale de Cambra"] },
  { distrito: "Beja", concelhos: ["Aljustrel", "Almodôvar", "Alvito", "Barrancos", "Beja", "Castro Verde", "Cuba", "Ferreira do Alentejo", "Mértola", "Moura", "Odemira", "Ourique", "Serpa", "Vidigueira"] },
  { distrito: "Braga", concelhos: ["Amares", "Barcelos", "Braga", "Cabeceiras de Basto", "Celorico de Basto", "Esposende", "Fafe", "Guimarães", "Póvoa de Lanhoso", "Terras de Bouro", "Vieira do Minho", "Vila Nova de Famalicão", "Vila Verde", "Vizela"] },
  { distrito: "Bragança", concelhos: ["Alfândega da Fé", "Bragança", "Carrazeda de Ansiães", "Freixo de Espada à Cinta", "Macedo de Cavaleiros", "Miranda do Douro", "Mirandela", "Mogadouro", "Torre de Moncorvo", "Vila Flor", "Vimioso", "Vinhais"] },
  { distrito: "Castelo Branco", concelhos: ["Belmonte", "Castelo Branco", "Covilhã", "Fundão", "Idanha-a-Nova", "Oleiros", "Penamacor", "Proença-a-Nova", "Sertã", "Vila de Rei", "Vila Velha de Ródão"] },
  { distrito: "Coimbra", concelhos: ["Arganil", "Cantanhede", "Coimbra", "Condeixa-a-Nova", "Figueira da Foz", "Góis", "Lousã", "Mira", "Miranda do Corvo", "Montemor-o-Velho", "Oliveira do Hospital", "Pampilhosa da Serra", "Penacova", "Penela", "Soure", "Tábua", "Vila Nova de Poiares"] },
  { distrito: "Évora", concelhos: ["Alandroal", "Arraiolos", "Borba", "Estremoz", "Évora", "Montemor-o-Novo", "Mora", "Mourão", "Portel", "Redondo", "Reguengos de Monsaraz", "Vendas Novas", "Viana do Alentejo", "Vila Viçosa"] },
  { distrito: "Faro", concelhos: ["Albufeira", "Alcoutim", "Aljezur", "Castro Marim", "Faro", "Lagoa", "Lagos", "Loulé", "Monchique", "Olhão", "Portimão", "São Brás de Alportel", "Silves", "Tavira", "Vila do Bispo", "Vila Real de Santo António"] },
  { distrito: "Guarda", concelhos: ["Aguiar da Beira", "Almeida", "Celorico da Beira", "Figueira de Castelo Rodrigo", "Fornos de Algodres", "Gouveia", "Guarda", "Manteigas", "Mêda", "Pinhel", "Sabugal", "Seia", "Trancoso", "Vila Nova de Foz Côa"] },
  { distrito: "Leiria", concelhos: ["Alcobaça", "Alvaiázere", "Ansião", "Batalha", "Bombarral", "Caldas da Rainha", "Castanheira de Pera", "Figueiró dos Vinhos", "Leiria", "Marinha Grande", "Nazaré", "Óbidos", "Pedrógão Grande", "Peniche", "Pombal", "Porto de Mós"] },
  { distrito: "Lisboa", concelhos: ["Alenquer", "Arruda dos Vinhos", "Azambuja", "Cadaval", "Cascais", "Lisboa", "Loures", "Lourinhã", "Mafra", "Odivelas", "Oeiras", "Sintra", "Sobral de Monte Agraço", "Torres Vedras", "Vila Franca de Xira"] },
  { distrito: "Portalegre", concelhos: ["Alter do Chão", "Arronches", "Avis", "Campo Maior", "Castelo de Vide", "Crato", "Elvas", "Fronteira", "Gavião", "Marvão", "Monforte", "Nisa", "Ponte de Sor", "Portalegre", "Sousel"] },
  { distrito: "Porto", concelhos: ["Amarante", "Baião", "Felgueiras", "Gondomar", "Lousada", "Maia", "Marco de Canaveses", "Matosinhos", "Paços de Ferreira", "Paredes", "Penafiel", "Porto", "Póvoa de Varzim", "Santo Tirso", "Trofa", "Valongo", "Vila do Conde", "Vila Nova de Gaia"] },
  { distrito: "Santarém", concelhos: ["Abrantes", "Alcanena", "Almeirim", "Alpiarça", "Benavente", "Cartaxo", "Chamusca", "Constância", "Coruche", "Entroncamento", "Ferreira do Zêzere", "Golegã", "Mação", "Ourém", "Rio Maior", "Salvaterra de Magos", "Santarém", "Sardoal", "Tomar", "Torres Novas", "Vila Nova da Barquinha"] },
  { distrito: "Setúbal", concelhos: ["Alcochete", "Almada", "Barreiro", "Moita", "Montijo", "Palmela", "Seixal", "Sesimbra", "Setúbal", "Alcácer do Sal", "Grândola", "Santiago do Cacém", "Sines"] },
  { distrito: "Viana do Castelo", concelhos: ["Arcos de Valdevez", "Caminha", "Melgaço", "Monção", "Paredes de Coura", "Ponte da Barca", "Ponte de Lima", "Valença", "Viana do Castelo", "Vila Nova de Cerveira"] },
  { distrito: "Vila Real", concelhos: ["Alijó", "Boticas", "Chaves", "Mesão Frio", "Mondim de Basto", "Montalegre", "Murça", "Peso da Régua", "Ribeira de Pena", "Sabrosa", "Santa Marta de Penaguião", "Valpaços", "Vila Pouca de Aguiar", "Vila Real"] },
  { distrito: "Viseu", concelhos: ["Armamar", "Carregal do Sal", "Castro Daire", "Cinfães", "Lamego", "Mangualde", "Moimenta da Beira", "Mortágua", "Nelas", "Oliveira de Frades", "Penalva do Castelo", "Penedono", "Resende", "Santa Comba Dão", "São João da Pesqueira", "São Pedro do Sul", "Sátão", "Sernancelhe", "Tabuaço", "Tarouca", "Tondela", "Vila Nova de Paiva", "Viseu", "Vouzela"] },
  { distrito: "Açores", concelhos: ["Angra do Heroísmo", "Calheta", "Corvo", "Horta", "Lajes das Flores", "Lajes do Pico", "Madalena", "Nordeste", "Ponta Delgada", "Ponta do Sol", "Povoação", "Praia da Vitória", "Ribeira Grande", "Santa Cruz da Graciosa", "Santa Cruz das Flores", "São Roque do Pico", "Velas", "Vila do Porto", "Vila Franca do Campo"] },
  { distrito: "Madeira", concelhos: ["Calheta", "Câmara de Lobos", "Funchal", "Machico", "Ponta do Sol", "Porto Moniz", "Porto Santo", "Ribeira Brava", "Santa Cruz", "Santana", "São Vicente"] }
];

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

  // 2. Criar Geografia (Distritos e Concelhos)
  console.log('Seed: Importing geography...');
  for (const item of geoData) {
    const d = await prisma.distrito.upsert({
      where: { nome: item.distrito },
      update: {},
      create: { nome: item.distrito },
    });

    for (const cNome of item.concelhos) {
      // Usamos findFirst/create para evitar duplicados se o seed rodar 2x
      const existingC = await prisma.conselho.findFirst({
        where: { nome: cNome, distritoId: d.id }
      });
      if (!existingC) {
        await prisma.conselho.create({
          data: { nome: cNome, distritoId: d.id }
        });
      }
    }
  }

  // 3. Importar Paróquias do JSON
  const jsonPath = path.join(process.cwd(), 'public', 'paroquias.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Seed: Importing ${data.length} paróquias...`);

    // Obter referências para o Porto (padrão)
    const distritoPorto = await prisma.distrito.findUnique({ where: { nome: 'Porto' } });
    const conselhoPorto = await prisma.conselho.findFirst({ 
      where: { nome: 'Porto', distritoId: distritoPorto?.id } 
    });

    for (const p of data) {
      // Evitar duplicar paróquias pelo nome
      const existingP = await prisma.paroquia.findFirst({ where: { nome: p.nome } });
      if (existingP) continue;

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
          distritoId: distritoPorto?.id,
          conselhoId: conselhoPorto?.id,
        },
      });

      // Importar Horários
      if (p.horarios && Array.isArray(p.horarios)) {
        for (const hText of p.horarios) {
          const parts = hText.split(')');
          const diaSemana = parts[0]?.replace('(', '') || 'Geral';
          const horaETipo = parts[1]?.trim() || hText;

          await prisma.horario.create({
            data: {
              diaSemana,
              hora: horaETipo,
              tipo: 'Eucaristia',
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