# Drizzle + Supabase

A starter template for using [Drizzle ORM](https://orm.drizzle.team/) with [Supabase](https://supabase.com/) PostgreSQL and [Hono.js](https://hono.dev/) backend.

## Setup

1. Install dependencies:

```bash
bun install
```

2. Set your Supabase credentials (already in `.zshrc` or copy `.env.example`):

```bash
cp .env.example .env
```

3. Test database connection:

```bash
bun run db:test
```

4. Push schema to database:

```bash
bun run db:push
```

5. Start the server:

```bash
bun run dev
```

## Commands

| Command               | Description                             |
| --------------------- | --------------------------------------- |
| `bun run dev`         | Start dev server with hot reload        |
| `bun run start`       | Start production server                 |
| `bun run db:test`     | Test database connection                |
| `bun run db:generate` | Generate migrations from schema changes |
| `bun run db:migrate`  | Apply migrations                        |
| `bun run db:push`     | Push schema directly (dev only)         |
| `bun run db:studio`   | Open Drizzle Studio                     |
| `bun test`            | Run all tests                           |
| `bun run test:db`     | Run database tests                      |
| `bun run test:api`    | Run API tests                           |
| `bun run test:schema` | Run schema validation tests             |

## API Endpoints

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/`              | API info             |
| GET    | `/health`        | Health check with DB |
| GET    | `/health/live`   | Liveness probe       |
| GET    | `/health/ready`  | Readiness probe      |
| GET    | `/api/users`     | List all users       |
| POST   | `/api/users`     | Create a user        |
| GET    | `/api/users/:id` | Get a user           |
| PATCH  | `/api/users/:id` | Update a user        |
| DELETE | `/api/users/:id` | Delete a user        |
| GET    | `/api/posts`     | List all posts       |
| POST   | `/api/posts`     | Create a post        |
| GET    | `/api/posts/:id` | Get a post           |
| PATCH  | `/api/posts/:id` | Update a post        |
| DELETE | `/api/posts/:id` | Delete a post        |

## Project Structure

```
├── src/
│   ├── api/
│   │   ├── index.ts           # Hono app setup
│   │   └── routes/
│   │       ├── health.ts      # Health check endpoints
│   │       ├── users.ts       # Users CRUD
│   │       └── posts.ts       # Posts CRUD
│   ├── db/
│   │   ├── index.ts           # Database connection
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── test-connection.ts # Connection test utility
│   │   └── migrations/        # Generated migrations
│   ├── tests/
│   │   ├── db.test.ts         # Database tests
│   │   ├── api.test.ts        # API endpoint tests
│   │   └── schema.test.ts     # Schema validation tests
│   └── server.ts              # Server entry point
├── drizzle.config.ts          # Drizzle Kit configuration
└── package.json
```

## Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Project Settings** > **Database**
4. Copy the **Connection string** (URI format) for `DATABASE_URL`
