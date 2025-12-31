# Drizzle + Supabase

A starter template for using [Drizzle ORM](https://orm.drizzle.team/) with [Supabase](https://supabase.com/) PostgreSQL database.

## Setup

1. Install dependencies:

```bash
bun install
```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

3. Push schema to database:

```bash
bun run db:push
```

4. Run the example:

```bash
bun run dev
```

## Commands

| Command               | Description                             |
| --------------------- | --------------------------------------- |
| `bun run dev`         | Run the app                             |
| `bun run db:generate` | Generate migrations from schema changes |
| `bun run db:migrate`  | Apply migrations                        |
| `bun run db:push`     | Push schema directly (dev only)         |
| `bun run db:studio`   | Open Drizzle Studio                     |

## Project Structure

```
├── src/
│   └── db/
│       ├── index.ts      # Database connection
│       ├── schema.ts     # Drizzle schema definitions
│       └── migrations/   # Generated migrations
├── drizzle.config.ts     # Drizzle Kit configuration
└── index.ts              # Example usage
```

## Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Project Settings** > **Database**
4. Copy the **Connection string** (URI format) for `DATABASE_URL`
