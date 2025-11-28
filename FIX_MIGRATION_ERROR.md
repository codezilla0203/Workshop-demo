# Fix: "Database schema is not empty" Error

## Problem
You're getting this error because:
- The database already has tables/data in it
- Prisma `migrate dev` requires an empty database or existing migrations
- You're trying to create a migration on a database that already has a schema

## Solution: Use `prisma db push` for Local Development

For **SQLite local development**, use `db push` instead of `migrate dev`:

```bash
npx prisma generate
npx prisma db push
```

### What's the difference?

- **`prisma db push`**: 
  - ✅ Syncs schema directly to database
  - ✅ No migration files needed
  - ✅ Perfect for local development
  - ✅ Works with existing databases
  - ⚠️ Not for production (use migrations instead)

- **`prisma migrate dev`**:
  - ✅ Creates migration files
  - ✅ Tracks schema changes
  - ✅ Required for production
  - ❌ Requires empty database or existing migrations
  - ❌ Won't work if database already has tables

## Quick Fix

If you're getting the error, just use:

```bash
npx prisma db push
```

This will sync your current schema to the database, even if it already has tables.

## For Production (Vercel)

When deploying to Vercel with PostgreSQL, you **must** use migrations:

1. **Change schema to PostgreSQL** (before deploying):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Create migration** (locally, pointing to your Vercel database):
   ```bash
   # Set DATABASE_URL to your Vercel Postgres connection string
   npx prisma migrate dev --name init
   ```

3. **Or let Vercel handle it** - The build script includes `prisma migrate deploy` which will run migrations automatically.

## Summary

- **Local Development (SQLite)**: Use `prisma db push` ✅
- **Production (PostgreSQL)**: Use `prisma migrate dev` and `prisma migrate deploy` ✅

The error you're seeing is because you're trying to use migrations on a database that already has tables. For local SQLite development, just use `db push` instead!

