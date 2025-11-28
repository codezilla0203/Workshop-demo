# Fix: "URL must start with the protocol `prisma://`" Error

## Problem
You're getting this error because:
- You have `PRISMA_DATABASE_URL` set (which uses `prisma://` protocol)
- But your Prisma schema is configured for standard PostgreSQL (`postgres://`)
- Prisma Accelerate requires special configuration

## Solution: Use Standard PostgreSQL Connection

### Step 1: Check Your Environment Variables in Vercel

Go to **Vercel** → Your Project → **Settings** → **Environment Variables**

You should have:
- ✅ `POSTGRES_URL` or `DATABASE_URL` with a `postgres://` connection string
- ❌ **Remove** `PRISMA_DATABASE_URL` (if you're not using Prisma Accelerate)

### Step 2: Get Your Vercel Postgres Connection String

1. Go to **Vercel** → Your Project → **Storage** tab
2. Click on your **Postgres** database
3. Find the **Connection String** (it should start with `postgres://`)
4. Copy it

### Step 3: Set Correct Environment Variables

In Vercel Environment Variables, set:

**Option A: Use DATABASE_URL (Recommended)**
```
DATABASE_URL="postgres://user:pass@host:5432/dbname?sslmode=require"
```

**Option B: Use POSTGRES_URL (Also Works)**
```
POSTGRES_URL="postgres://user:pass@host:5432/dbname?sslmode=require"
```

**Important:**
- The connection string MUST start with `postgres://` (NOT `prisma://`)
- Remove `PRISMA_DATABASE_URL` if you're not using Prisma Accelerate
- Make sure it's the Vercel Postgres connection string (from Storage tab)

### Step 4: Verify Prisma Schema

Your `prisma/schema.prisma` should have:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

This is correct - it expects a `postgres://` URL, not `prisma://`.

### Step 5: Redeploy

1. Save the environment variables
2. **Redeploy** your application
3. Check build logs to ensure migrations run

## If You Want to Use Prisma Accelerate

If you specifically want to use Prisma Accelerate (connection pooling service):

1. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("PRISMA_DATABASE_URL")  // Use Accelerate URL
   }
   ```

2. **Install Prisma Accelerate:**
   ```bash
   npm install @prisma/extension-accelerate
   ```

3. **Update `lib/prisma.ts`** to use Accelerate extension

4. **Set `PRISMA_DATABASE_URL`** in Vercel (the one starting with `prisma://`)

**Note:** Prisma Accelerate is a paid service. For most projects, standard PostgreSQL is sufficient.

## Quick Fix (Recommended)

1. **Remove** `PRISMA_DATABASE_URL` from Vercel environment variables
2. **Set** `DATABASE_URL` or `POSTGRES_URL` with your Vercel Postgres connection string (starts with `postgres://`)
3. **Redeploy**

The code already supports both `DATABASE_URL` and `POSTGRES_URL`, so either will work.

## Troubleshooting

### Still Getting the Error?

1. **Check build logs** - Look for what connection string is being used
2. **Verify environment variables** - Make sure you're using `postgres://` not `prisma://`
3. **Clear Vercel cache** - Sometimes old env vars are cached
4. **Redeploy** - Make sure new environment variables are picked up

### Connection String Format

✅ **Correct:**
```
postgres://user:password@host:5432/database?sslmode=require
```

❌ **Wrong (for standard Prisma):**
```
prisma://accelerate.prisma-data.net/?api_key=...
```

The `prisma://` format is ONLY for Prisma Accelerate, which requires additional setup.

