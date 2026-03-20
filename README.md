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
| Deploy | Render |
