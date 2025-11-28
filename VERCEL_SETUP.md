# Complete Vercel Deployment Guide

## Quick Setup Steps

### 1. Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Create Vercel Account & Project
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js

### 3. Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

#### Required:
- **JWT_SECRET**: Generate with `openssl rand -base64 32` (minimum 32 characters)

#### For PostgreSQL (if using):
- **DATABASE_URL**: Your PostgreSQL connection string

### 4. Database Setup Options

#### Option A: Vercel Postgres (Recommended)

1. In Vercel project dashboard
2. Click **Storage** tab (left sidebar)
3. Click **Create Database**
4. Select **Postgres**
5. Choose **Hobby** plan (free tier)
6. Click **Create**
7. Vercel automatically:
   - Creates the database
   - Adds `DATABASE_URL` to environment variables
   - Configures connection

#### Option B: External PostgreSQL

**Using Supabase (Free):**
1. Go to [supabase.com](https://supabase.com)
2. Create account → New Project
3. Go to **Settings** → **Database**
4. Copy **Connection String** (URI format)
5. In Vercel: Add `DATABASE_URL` = your connection string

**Using Neon (Free):**
1. Go to [neon.tech](https://neon.tech)
2. Create account → New Project
3. Copy connection string
4. In Vercel: Add `DATABASE_URL` = your connection string

### 5. Update Prisma for PostgreSQL

**Before deploying**, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 6. Create Database Migration

```bash
# Create initial migration
npx prisma migrate dev --name init

# This creates prisma/migrations folder
# Commit this folder to Git
git add prisma/migrations
git commit -m "Add database migrations"
git push
```

### 7. Deploy

1. Vercel will automatically deploy when you push to GitHub
2. Or manually trigger: Vercel dashboard → **Deployments** → **Redeploy**

### 8. Verify Deployment

1. Check deployment logs for any errors
2. Visit your deployed URL
3. Test signup/login functionality

## Environment Variables Summary

| Variable | Required | Where to Get | Example |
|----------|----------|--------------|---------|
| `JWT_SECRET` | ✅ Yes | Generate: `openssl rand -base64 32` | `abc123...xyz789` (32+ chars) |
| `DATABASE_URL` | ✅ Yes (for PostgreSQL) | Vercel Postgres or external provider | `postgresql://user:pass@host/db` |

## Troubleshooting

### "Database not initialized" Error
- **Cause**: Database migrations haven't run
- **Fix**: Check build logs, ensure `prisma migrate deploy` runs during build

### "JWT_SECRET: Required" Error
- **Cause**: Environment variable not set
- **Fix**: Add `JWT_SECRET` in Vercel → Settings → Environment Variables

### Build Fails on Prisma
- **Cause**: Prisma client not generated
- **Fix**: The `postinstall` script should handle this automatically

### Database Connection Errors
- **Cause**: Wrong `DATABASE_URL` or database not accessible
- **Fix**: Verify connection string, check database is running

## Migration Commands

```bash
# Development (creates migration file)
npx prisma migrate dev --name migration_name

# Production (applies migrations)
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Important Notes

⚠️ **SQLite doesn't work on Vercel** - The file system is read-only
✅ **Use PostgreSQL** for Vercel deployments
✅ **Migrations run automatically** during build (if configured)
✅ **Environment variables** are set per environment (production, preview, development)

