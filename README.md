# Paróquia Perto

Plataforma para aproximar fiéis das paróquias locais, oferecendo informações sobre missas, eventos e localização das igrejas.

Migrated from React + Spring Boot (Java) to **Next.js + Prisma** for a unified full-stack solution.

---

## 📦 Estrutura do Projeto

```
/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # API endpoints (replaces Java backend)
│   │   ├── auth/          # Authentication (login, register, google)
│   │   ├── paroquias/     # Parishes CRUD
│   │   ├── horarios/      # Mass schedules CRUD
│   │   ├── eventos/       # Events CRUD
│   │   ├── distritos/     # Districts list
│   │   ├── conselhos/     # Councils list
│   │   └── usuario/       # User profile
│   ├── paroquias/         # Parish listing & detail pages
│   ├── backoffice/        # Admin panel (protected)
│   └── ...
├── components/            # Reusable React components
├── lib/                   # Utilities (Prisma client, JWT auth)
├── prisma/                # Prisma schema & migrations
├── public/                # Static assets
└── styles/                # CSS files
```

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 20+
- PostgreSQL database (or Neon, Railway, Supabase)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID

# Generate Prisma client
npx prisma generate

# Create database tables (first time or after schema changes)
npx prisma db push

# Seed the database with an initial admin user
npx prisma db seed

# Start development server
npm run dev  # Runs on http://localhost:3000
```

> **Credenciais do utilizador admin padrão:** `admin@paroquiaperto.pt` / `Admin123!`
> Altere imediatamente após o primeiro login (perfil do utilizador).
> Pode personalizar as credenciais através das variáveis de ambiente `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_NAME`.

## ☁️ Deploy no Vercel

1. Importe o repositório no [Vercel](https://vercel.com/new).
2. Nas configurações do projeto no Vercel, certifique-se de que:
   - **Framework Preset**: Next.js
   - **Root Directory**: `/` (raiz do repositório)
   - **Node.js Version**: 20.x *(detectado automaticamente pelo ficheiro `.node-version` na raiz)*
   - **Build Command**: `npx prisma db push && npx prisma db seed && npm run build` *(já definido em `vercel.json`)*
   - **Install Command**: `npm install` *(já definido em `vercel.json`; executa `prisma generate` automaticamente via `postinstall`)*
3. Adicione as seguintes variáveis de ambiente no painel do Vercel (**Settings → Environment Variables**):

   | Variável | Obrigatória | Descrição |
   |---|---|---|
   | `DATABASE_URL` | ✅ Sim | String de ligação PostgreSQL (ex: Neon, Supabase, Railway) |
   | `JWT_SECRET` | ✅ Sim | Chave secreta para geração de tokens JWT (string aleatória longa) |
   | `APP_URL` | ✅ Sim (recomendado) | URL pública canónica do site (ex: `https://paroquiaperto.vercel.app`) — usada para construir links de recuperação e confirmação |
   | `NEXT_PUBLIC_APP_URL` | ⚪ Opcional (fallback) | Fallback para geração de links quando `APP_URL` não está definido |
   | `BREVO_API_KEY` | ✅ Sim | Chave da API Brevo para envio de e-mails transacionais |
   | `BREVO_SENDER_EMAIL` | ✅ Sim | E-mail remetente validado na Brevo (ex: `no-reply@paroquiaperto.pt`) |
   | `CLOUDINARY_CLOUD_NAME` | ✅ Sim (para upload de imagens) | Nome da cloud no Cloudinary |
   | `CLOUDINARY_API_KEY` | ✅ Sim (para upload de imagens) | API Key da conta Cloudinary |
   | `CLOUDINARY_API_SECRET` | ✅ Sim (para upload de imagens) | API Secret da conta Cloudinary |
   | `ADMIN_EMAIL` | ⚪ Opcional | E-mail do utilizador admin inicial (padrão: `admin@paroquiaperto.pt`) |
   | `ADMIN_PASSWORD` | ⚪ Opcional | Palavra-passe do admin inicial (padrão: `Admin123!`) |
   | `ADMIN_NAME` | ⚪ Opcional | Nome do admin inicial (padrão: `Administrador`) |

4. Clique em **Deploy**.

> **Notas:**
> - O comando de build inclui `prisma db push` (cria/atualiza as tabelas na base de dados) e `prisma db seed` (cria o utilizador admin inicial se ainda não existir). Ambos são seguros de correr em cada deploy.
> - O fluxo de recuperação/validação de conta usa Brevo (`BREVO_API_KEY` e `BREVO_SENDER_EMAIL`), não SMTP.
> - Após o primeiro login com o admin, altere imediatamente a palavra-passe no perfil do utilizador.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Backend | Next.js API Routes |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT |
| Maps | Leaflet + React-Leaflet |
| UI | Tailwind CSS + Custom CSS |
| Deploy | Vercel |
