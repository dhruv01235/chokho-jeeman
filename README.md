# Chokho Jeeman — Authentic Rajasthani Restaurant

Enterprise-grade restaurant website built with Next.js 16, TypeScript, Tailwind CSS v4, Three.js, Framer Motion, GSAP, Socket.IO, PostgreSQL, Redis, and Docker.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Animation | Framer Motion, GSAP, Three.js + React Three Fiber |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL 16 |
| Cache / Real-time | Redis 7, Socket.IO |
| Auth | NextAuth.js (Google OAuth, JWT) |
| Container | Docker, Docker Compose |
| CI/CD | GitHub Actions |

## Getting Started

```bash
# Clone
git clone https://github.com/your-org/chokho-jeeman.git
cd chokho-jeeman

# Install
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Start databases (Docker)
docker compose up -d db redis

# Run migrations
npx prisma migrate dev --name init

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Docker

```bash
docker compose up -d
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — luxury intro, hero, features, specials |
| `/about` | About the restaurant |
| `/story` | Royal heritage story |
| `/menu` | Interactive menu with categories |
| `/gallery` | Filterable image gallery |
| `/reservation` | Table reservation with calendar, floor map, QR |
| `/queue` | Live waiting queue with real-time updates |
| `/contact` | Contact form and info |
| `/admin` | Admin dashboard — analytics, menu CMS, inventory |
| `/customer/dashboard` | Customer reservation dashboard |

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | `/api/menu` | Menu CRUD |
| GET/POST/PUT | `/api/reservation` | Reservation management |
| GET/POST/PUT | `/api/queue` | Queue management |
| GET/POST/PUT/DELETE | `/api/inventory` | Inventory management |
| GET | `/api/analytics` | Dashboard analytics |

## Features

- **Real-time Queue**: Socket.IO powered live waiting queue
- **Interactive Floor Map**: SVG-based table selection
- **QR Reservation**: Auto-generated QR codes for check-in
- **3D Food Cards**: Three.js powered 3D menu items
- **Cursor Effects**: Custom cursor trails
- **Luxury Intro**: Animated splash screen
- **Parallax Scrolling**: Smooth scroll-driven animations
- **Glassmorphism UI**: Modern glass-effect cards
- **Steam Effects**: Animated steam particles
- **Role-based Auth**: Customer, Staff, Admin roles
- **Full CMS**: Menu and inventory management
- **Analytics Dashboard**: Reservation stats, peak hours, revenue

## Architecture

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # REST API endpoints
│   ├── about/              # About page
│   ├── admin/              # Admin dashboard
│   ├── contact/            # Contact page
│   ├── dashboard/          # Customer dashboard
│   ├── gallery/            # Gallery page
│   ├── menu/               # Interactive menu
│   ├── queue/              # Live waiting queue
│   └── reservation/        # Table reservation
├── components/
│   ├── animations/         # Luxury intro, page transitions, parallax
│   ├── providers/          # Session providers
│   ├── three/              # Three.js 3D components
│   └── ui/                 # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Database, Redis, Socket clients
├── services/               # Business logic
├── server.ts               # Socket.IO server
└── types/                  # TypeScript type definitions
```

## License

Proprietary — Chokho Jeeman Restaurant
