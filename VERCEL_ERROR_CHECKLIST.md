# Vercel Error Troubleshooting Checklist

## Most Common Issues

### 1. Schema is Set to SQLite (Most Likely Issue) ⚠️

**Problem**: Your `prisma/schema.prisma` is set to SQLite for local development, but Vercel needs PostgreSQL.

**Fix**: Before deploying to Vercel, change the schema:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite" to "postgresql"
  url      = env("DATABASE_URL")
}
```

**Steps**:
1. Update `prisma/schema.prisma` to use `postgresql`
2. Commit and push to GitHub
3. Vercel will automatically redeploy

### 2. Missing Environment Variables

**Check in Vercel** → Settings → Environment Variables:

- ✅ `DATABASE_URL` - Your Vercel Postgres connection string (starts with `postgres://`)
- ✅ `JWT_SECRET` - Minimum 32 characters

**Important**: 
- Use `DATABASE_URL` (not `POSTGRES_URL` or `PRISMA_DATABASE_URL`)
- Connection string must start with `postgres://` (not `prisma://`)

### 3. Database Migrations Not Running

**Check build logs** in Vercel. You should see:
```
Running prisma migrate deploy...
```

If migrations didn't run:
- Check that `package.json` build script includes: `prisma migrate deploy`
- Verify `DATABASE_URL` is set correctly
- Check build logs for migration errors

### 4. Wrong Connection String

**Problem**: Using Prisma-hosted database instead of Vercel Postgres.

**Fix**:
1. Go to Vercel → Storage → Your Postgres database
2. Copy the connection string (from Storage tab, not from Prisma)
3. Update `DATABASE_URL` in Vercel environment variables

### 5. Database Not Initialized

**Error**: "Database error occurred" or "Unable to open database"

**Fix**: Run migrations manually:
```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

Or via Vercel dashboard terminal.

## Quick Fix Steps

1. **Check Schema** - Must be PostgreSQL for Vercel
2. **Check Environment Variables** - `DATABASE_URL` and `JWT_SECRET` set
3. **Check Build Logs** - Look for migration errors
4. **Check Connection String** - Must be Vercel Postgres (starts with `postgres://`)
5. **Redeploy** - After fixing, trigger a new deployment

## What Error Are You Seeing?

Please share:
- The exact error message from Vercel logs
- Which endpoint is failing (login, signup, etc.)
- Build log errors (if any)

This will help me provide a more specific solution!

