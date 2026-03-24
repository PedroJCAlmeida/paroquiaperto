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
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ✅ Sim | Client ID da Google OAuth (para login com Google) |
   | `APP_URL` | ✅ Sim | URL pública do site (ex: `https://paroquiaperto.vercel.app`) — usada nos e-mails de recuperação de palavra-passe |
   | `SMTP_HOST` | ✅ Sim | Servidor SMTP para envio de e-mails (ex: `smtp.gmail.com`) |
   | `SMTP_PORT` | ✅ Sim | Porta SMTP (ex: `587` para TLS, `465` para SSL) |
   | `SMTP_USER` | ✅ Sim | Utilizador SMTP (normalmente o endereço de e-mail) |
   | `SMTP_PASS` | ✅ Sim | Palavra-passe SMTP (ou App Password se usar Gmail) |
   | `SMTP_FROM` | ✅ Sim | Endereço de e-mail remetente (ex: `no-reply@paroquiaperto.pt`) |
   | `ADMIN_EMAIL` | ⚪ Opcional | E-mail do utilizador admin inicial (padrão: `admin@paroquiaperto.pt`) |
   | `ADMIN_PASSWORD` | ⚪ Opcional | Palavra-passe do admin inicial (padrão: `Admin123!`) |
   | `ADMIN_NAME` | ⚪ Opcional | Nome do admin inicial (padrão: `Administrador`) |

4. Clique em **Deploy**.

> **Notas:**
> - O comando de build inclui `prisma db push` (cria/atualiza as tabelas na base de dados) e `prisma db seed` (cria o utilizador admin inicial se ainda não existir). Ambos são seguros de correr em cada deploy.
> - O `NEXT_PUBLIC_GOOGLE_CLIENT_ID` tem de ser configurado também na [Google Cloud Console](https://console.cloud.google.com/) com o domínio Vercel como origem autorizada (ex: `https://paroquiaperto.vercel.app`).
> - Após o primeiro login com o admin, altere imediatamente a palavra-passe no perfil do utilizador.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Backend | Next.js API Routes |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + Google OAuth |
| Maps | Leaflet + React-Leaflet |
| UI | Tailwind CSS + Custom CSS |
| Deploy | Vercel |
