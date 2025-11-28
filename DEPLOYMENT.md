# Deployment Guide

## Vercel Deployment

### Required Environment Variables

**JWT_SECRET** (Required)
- Must be at least 32 characters long
- Generate a secure secret:
  ```bash
  openssl rand -base64 32
  ```
- Or use an online generator (ensure it's at least 32 characters)
- Set in Vercel: Settings → Environment Variables

### Steps to Deploy

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel project settings
   - Go to "Environment Variables"
   - Add: `JWT_SECRET` with your generated secret (min 32 chars)

4. **Deploy**
   - Vercel will automatically detect Next.js
   - Build command: `npm run build` (already configured)
   - Deploy!

### Database Setup

**Option 1: SQLite (Quick Demo - Not Recommended for Production)**
- SQLite works for demos but has limitations in serverless environments
- Vercel's file system is read-only, so SQLite won't work on Vercel
- **Use this only for local development**

**Option 2: PostgreSQL (Recommended for Vercel)**

#### Step 1: Create a PostgreSQL Database

**Option A: Vercel Postgres (Easiest)**
1. In your Vercel project dashboard
2. Go to **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a plan (Hobby plan is free for small projects)
6. Vercel will automatically create and configure the database
7. The `DATABASE_URL` will be automatically added to your environment variables

**Option B: External PostgreSQL (Supabase, Neon, etc.)**
1. Create account at [Supabase](https://supabase.com) or [Neon](https://neon.tech) (both have free tiers)
2. Create a new PostgreSQL database
3. Copy the connection string (looks like: `postgresql://user:pass@host:5432/dbname`)
4. In Vercel: **Settings** → **Environment Variables**
5. Add: `DATABASE_URL` = your PostgreSQL connection string

#### Step 2: Update Prisma Schema

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Step 3: Create Migration

```bash
# Create initial migration
npx prisma migrate dev --name init

# This creates a migrations folder
```

#### Step 4: Configure Vercel Build

Vercel will automatically run Prisma migrations during build, but you can also add a build script:

In `package.json`, the build script should be:
```json
{
  "scripts": {
    "build": "prisma generate --no-engine && prisma migrate deploy && next build"
  }
}
```

**Note**: 
- `--no-engine` flag is recommended for production to reduce bundle size
- The current build script already includes this optimization
- Migrations will run automatically during build

#### Step 5: Deploy

1. Push your code to GitHub
2. Vercel will automatically:
   - Install dependencies
   - Run `prisma generate`
   - Run `prisma migrate deploy` (if you add it to build script)
   - Build and deploy your app

#### Alternative: Manual Migration (If needed)

If migrations don't run automatically, you can run them manually via Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migration
vercel env pull .env.local
npx prisma migrate deploy
```

Or use Vercel's built-in terminal:
1. Go to your project in Vercel dashboard
2. Click **Deployments** tab
3. Click on a deployment
4. Use the terminal to run: `npx prisma migrate deploy`

**For Demo (SQLite):**
- SQLite works but has limitations
- Database file is stored in `.vercel` directory
- Not recommended for production with multiple instances

## Other Platforms

### Render
1. Connect GitHub repository
2. Set environment variables:
   - `JWT_SECRET` (min 32 chars)
   - `DATABASE_URL` (if using PostgreSQL)
3. Build command: `npm run build`
4. Start command: `npm start`

### Railway
1. Connect GitHub repository
2. Add environment variables:
   - `JWT_SECRET` (min 32 chars)
3. Railway auto-detects Next.js

### AWS / DigitalOcean
- Follow standard Next.js deployment guides
- Ensure `JWT_SECRET` is set
- Use PostgreSQL for production databases

## Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `JWT_SECRET` | ✅ Yes | Secret key for JWT tokens (min 32 chars) | `openssl rand -base64 32` |
| `DATABASE_URL` | ⚠️ Optional | Database connection string (for PostgreSQL) | `postgresql://...` |
| `NODE_ENV` | ❌ No | Auto-set by platform | `production` |

## Troubleshooting

### "JWT_SECRET: Required" Error
- **Solution**: Set `JWT_SECRET` environment variable in your deployment platform
- **Generate**: `openssl rand -base64 32`
- **Minimum**: 32 characters

### Database Connection Issues
- For SQLite: Ensure write permissions
- For PostgreSQL: Check connection string format
- Verify `DATABASE_URL` is set correctly

### Build Failures
- Check Node.js version (requires 18+)
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

