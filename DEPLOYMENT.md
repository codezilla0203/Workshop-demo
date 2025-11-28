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

**For Production:**
- SQLite is fine for demos, but for production consider PostgreSQL
- Update `prisma/schema.prisma` datasource to:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```
- Add `DATABASE_URL` environment variable in Vercel
- Run migrations: `npx prisma migrate deploy`

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

