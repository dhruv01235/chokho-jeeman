# Chokho Jeeman — Production Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (for containerized deployment)

## Quick Start (Docker)

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env with production values (see Environment Variables below)

# 2. Generate secrets
openssl rand -base64 32  # Use output as NEXTAUTH_SECRET

# 3. Start all services
docker compose up -d

# 4. Run database migrations
docker compose exec app npx prisma migrate deploy

# 5. Seed menu data (if needed)
docker compose exec app npx prisma db seed
```

## Quick Start (Manual)

```bash
# 1. Install dependencies
npm ci

# 2. Configure environment
cp .env.example .env
# Edit .env with production values

# 3. Generate NextAuth secret
openssl rand -base64 32

# 4. Run database migrations
npx prisma migrate deploy

# 5. Build and start
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Random secret for NextAuth.js sessions |
| `NEXTAUTH_URL` | Yes | Canonical URL (e.g. `https://chokhojeeman.com`) |
| `REDIS_URL` | Yes | Redis connection string |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `SOCKET_PORT` | No | Socket.IO server port (default: `3001`) |
| `CLIENT_URL` | Yes | Frontend URL for CORS (e.g. `https://chokhojeeman.com`) |
| `NEXT_PUBLIC_SOCKET_URL` | Yes | Public Socket.IO URL for client |
| `POSTGRES_PASSWORD` | No | PostgreSQL password (default: `postgres`) |

### Generating `NEXTAUTH_SECRET`

```bash
openssl rand -base64 32
```

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Next.js     │────▶│  PostgreSQL   │     │    Redis      │
│  (port 3000) │     │  (port 5432)  │     │  (port 6379)  │
└─────────────┘     └──────────────┘     └──────────────┘
       │
       │          ┌──────────────┐
       └─────────▶│  Socket.IO    │
                  │  (port 3001)  │
                  └──────────────┘
```

## Services

| Service | Port | Description |
|---|---|---|
| `app` | 3000 | Next.js application (standalone) |
| `socket` | 3001 | Socket.IO real-time server |
| `db` | 5432 | PostgreSQL database |
| `redis` | 6379 | Redis cache/pub-sub |

## Security Headers

The following headers are set automatically via `next.config.ts`:

- `Strict-Transport-Security` — HSTS with 2-year max-age
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy` — camera, microphone, geolocation disabled
- `X-DNS-Prefetch-Control: on`
- `X-Powered-By` header removed

## Database

### Prisma Models

- **User** — Google OAuth users (admin/customer roles)
- **Account** — OAuth account links
- **Session** — Active sessions
- **Reservation** — Table reservations (PENDING/CONFIRMED/CANCELLED)
- **MenuItem** — Menu items with pricing, categories, images
- **InventoryItem** — Kitchen inventory tracking
- **QueueItem** — Walk-in queue management (WAITING/SEATED/CANCELLED)

### Running Migrations

```bash
# Deploy pending migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (dev only)
npx prisma studio
```

## Socket.IO

The Socket.IO server runs as a separate process on port 3001.

### Events

| Event | Direction | Description |
|---|---|---|
| `join-queue` | Client → Server | Client joins the queue |
| `queue-updated` | Server → All | Queue state changed |

### Production Notes

- CORS restricted to `CLIENT_URL` env var
- Configurable via `SOCKET_PORT` env var
- No data logging in production

## Performance

- **Next.js standalone** output — minimal Docker image
- **Static pages** pre-rendered at build time (/, /about, /menu, /contact, /gallery, /story, /queue, /reservation)
- **Dynamic pages** server-rendered on demand (/admin, /dashboard, /api/*)
- **Turbopack** used for build optimization
- **Images** served from `public/images/menu/` (32 JPEGs, ~2.2 MB total)
- **Font loading** optimized with `next/font`

## Deployment Platforms

### Vercel (Recommended)

```bash
# Vercel auto-detects Next.js. Just connect your repo.
# Set environment variables in Vercel dashboard.
# Note: Socket.IO requires a separate server or Vercel's Edge Runtime.
```

### AWS / GCP / DigitalOcean

```bash
# Use Docker Compose for container orchestration
# Ensure PostgreSQL and Redis are accessible
# Set CLIENT_URL to your domain
# Configure reverse proxy (nginx/caddy) for SSL
```

### Manual Server

```bash
# 1. Install Node.js 20, PostgreSQL 16, Redis 7
# 2. Configure .env
# 3. npm ci && npm run build
# 4. Use PM2 or systemd to manage processes:
#    - next start (port 3000)
#    - tsx src/server.ts (port 3001)
```

## SSL / HTTPS

Use a reverse proxy (nginx, Caddy, or Cloudflare) to terminate SSL. Set `NEXTAUTH_URL` and `CLIENT_URL` to your HTTPS domain.

## Troubleshooting

| Issue | Solution |
|---|---|
| `NEXTAUTH_SECRET not set` | Generate with `openssl rand -base64 32` and add to `.env` |
| Socket.IO connection refused | Ensure `SOCKET_PORT` matches and `CLIENT_URL` is set |
| Database connection failed | Check `DATABASE_URL` and PostgreSQL is running |
| Redis connection failed | Check `REDIS_URL` and Redis is running |
| Image 404s | Verify `public/images/menu/` files exist |
| Build fails | Run `npx prisma generate` before `npm run build` |
