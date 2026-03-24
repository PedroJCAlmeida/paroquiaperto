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

# Run database migrations (first time)
npx prisma db push

# Start development server
npm run dev  # Runs on http://localhost:3000
```

## ☁️ Deploy no Vercel

1. Importe o repositório no [Vercel](https://vercel.com/new).
2. Nas configurações do projeto no Vercel, certifique-se de que:
   - **Framework Preset**: Next.js
   - **Root Directory**: `/` (raiz do repositório)
   - **Build Command**: `npx prisma generate && npm run build` *(já definido em `vercel.json`)*
3. Adicione as variáveis de ambiente no painel do Vercel:
   - `DATABASE_URL` — string de ligação PostgreSQL (ex: Neon, Supabase, Railway)
   - `JWT_SECRET` — chave secreta para geração de tokens JWT
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Client ID da Google OAuth
4. Clique em **Deploy**.

> **Nota:** O script `postinstall` no `package.json` executa `prisma generate` automaticamente após `npm install`, garantindo que o Prisma Client seja gerado antes do `next build`.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | Next.js API Routes |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + Google OAuth |
| Maps | Leaflet + React-Leaflet |
| UI | Tailwind CSS + Custom CSS |
| Deploy | Vercel |
