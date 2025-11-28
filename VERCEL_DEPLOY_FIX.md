# Fix Vercel Deployment - Change Schema to PostgreSQL

## The Problem

Your `prisma/schema.prisma` is currently set to SQLite (for local development), but **Vercel requires PostgreSQL**.

## Quick Fix

### Step 1: Update Prisma Schema for Vercel

Change `prisma/schema.prisma` from:
```prisma
datasource db {
  provider = "sqlite"  // ❌ Won't work on Vercel
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "postgresql"  // ✅ Required for Vercel
  url      = env("DATABASE_URL")
}
```

### Step 2: Create Initial Migration

Since you're switching from SQLite to PostgreSQL, you need to create a migration:

```bash
# Make sure DATABASE_URL points to your Vercel Postgres
# You can temporarily set it in .env or use Vercel CLI
npx prisma migrate dev --name init
```

This will create a `prisma/migrations` folder with your initial schema.

### Step 3: Commit and Push

```bash
git add prisma/
git commit -m "Update schema to PostgreSQL for Vercel deployment"
git push
```

Vercel will automatically:
1. Run `prisma generate --no-engine`
2. Run `prisma migrate deploy`
3. Build your Next.js app

## Alternative: Use Different Schemas for Local vs Production

If you want to keep SQLite for local development, you can:

### Option A: Manual Switch (Before Each Deploy)

1. Change schema to PostgreSQL
2. Commit and push
3. After deploy, change back to SQLite for local dev

### Option B: Use Environment-Based Schema (Advanced)

Create two schema files and switch based on environment, but this is more complex.

## Verify Your Vercel Setup

1. **Environment Variables** (Vercel → Settings → Environment Variables):
   - ✅ `DATABASE_URL` - Your Vercel Postgres connection string
   - ✅ `JWT_SECRET` - Minimum 32 characters

2. **Database** (Vercel → Storage):
   - ✅ PostgreSQL database created
   - ✅ Connection string copied to `DATABASE_URL`

3. **Build Script** (package.json):
   - ✅ Includes `prisma migrate deploy`

## After Fixing

1. Check Vercel build logs - should see migrations running
2. Test your deployed app
3. If errors persist, share the specific error message

## What Error Are You Seeing?

Please share:
- The exact error message from Vercel logs
- Which endpoint/action is failing
- Build log output (especially Prisma-related errors)

This will help me provide a more targeted fix!

