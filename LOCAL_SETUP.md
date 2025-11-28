# Local Development Setup

## Quick Fix: DATABASE_URL Not Found Error

If you're getting `Environment variable not found: DATABASE_URL`, you need to create a `.env` file.

## Option 1: Use SQLite for Local Development (Easiest)

1. **Create a `.env` file** in the project root:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="development-secret-key-min-32-chars-required-for-local-dev-only"
   ```

2. **Update `prisma/schema.prisma`** to use SQLite for local:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Run Prisma commands:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Option 2: Use PostgreSQL for Local Development

1. **Set up a local PostgreSQL database** (or use Docker):
   ```bash
   # Using Docker
   docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=workshop -p 5432:5432 -d postgres
   ```

2. **Create a `.env` file:**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/workshop"
   JWT_SECRET="development-secret-key-min-32-chars-required-for-local-dev-only"
   ```

3. **Run Prisma commands:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

## Option 3: Use Your Vercel Postgres (Not Recommended)

You can use your Vercel Postgres connection string locally, but this is not recommended as it will affect your production database.

1. **Create a `.env` file:**
   ```env
   DATABASE_URL="postgres://your-vercel-postgres-connection-string"
   JWT_SECRET="development-secret-key-min-32-chars-required-for-local-dev-only"
   ```

## Recommended: Use SQLite Locally, PostgreSQL in Production

This is the best approach - use SQLite for local development and PostgreSQL for production.

### Step 1: Create `.env` file
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="development-secret-key-min-32-chars-required-for-local-dev-only"
```

### Step 2: Update Prisma Schema for Local Development

Temporarily change `prisma/schema.prisma` to:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 3: Initialize Database
```bash
npx prisma generate
npx prisma db push
```

**Note**: For SQLite, use `prisma db push` instead of `prisma migrate dev`. The `db push` command syncs your schema directly without creating migration files, which is perfect for local development.

### Step 4: Before Deploying to Vercel

Change `prisma/schema.prisma` back to PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Quick Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (SQLite)
npx prisma db push

# Create migration (PostgreSQL)
npx prisma migrate dev --name init

# View database in Prisma Studio
npx prisma studio
```

## Environment Variables Summary

| Variable | Local Development | Production (Vercel) |
|----------|------------------|---------------------|
| `DATABASE_URL` | `file:./prisma/dev.db` (SQLite) | `postgres://...` (PostgreSQL) |
| `JWT_SECRET` | Any 32+ char string | Secure random 32+ char string |

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- **Solution**: Create a `.env` file with `DATABASE_URL` set
- See options above

### "Unable to open the database file"
- **Solution**: Run `npx prisma db push` to create the database file
- Make sure the `prisma` directory exists

### Database connection errors
- **SQLite**: Check file permissions, ensure `prisma` directory exists
- **PostgreSQL**: Verify connection string, check if database is running

