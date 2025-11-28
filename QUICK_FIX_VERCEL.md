# Quick Fix: Database Error on Vercel Login

## Problem
You set `POSTGRES_URL` but Prisma expects `DATABASE_URL`.

## Solution (Choose One)

### Option 1: Rename Environment Variable (Easiest) ✅

1. Go to **Vercel** → Your Project → **Settings** → **Environment Variables**
2. Find `POSTGRES_URL`
3. **Delete** it
4. **Add new** environment variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Copy the value from `POSTGRES_URL`
   - **Environment**: Select all (Production, Preview, Development)
5. **Save**
6. **Redeploy** your application

### Option 2: Keep POSTGRES_URL (Code Updated) ✅

I've updated the code to automatically use `POSTGRES_URL` if `DATABASE_URL` is not set. 

**You still need to:**
1. Make sure `POSTGRES_URL` is set in Vercel
2. **Redeploy** your application (so the code changes take effect)
3. The code will automatically map `POSTGRES_URL` → `DATABASE_URL`

## Additional Steps

### 1. Verify Database Migrations Ran

Check your Vercel build logs. You should see:
```
Running prisma migrate deploy...
```

If migrations didn't run, you need to run them manually:

**Via Vercel CLI:**
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma migrate deploy
```

**Or via Vercel Dashboard:**
1. Go to your deployment
2. Open terminal/console
3. Run: `npx prisma migrate deploy`

### 2. Check Database Connection

Make sure your Vercel Postgres database is:
- ✅ Active (not paused)
- ✅ Accessible
- ✅ Has the correct connection string

### 3. Verify Environment Variables

In Vercel, make sure you have:
- ✅ `DATABASE_URL` OR `POSTGRES_URL` (with your Vercel Postgres connection string)
- ✅ `JWT_SECRET` (minimum 32 characters)

## Quick Checklist

- [ ] Set `DATABASE_URL` in Vercel (or keep `POSTGRES_URL` and redeploy)
- [ ] Set `JWT_SECRET` in Vercel
- [ ] Database migrations have run (`prisma migrate deploy`)
- [ ] Redeployed application
- [ ] Checked build logs for errors
- [ ] Tested login functionality

## Still Not Working?

1. **Check build logs** - Look for migration or connection errors
2. **Verify connection string** - Make sure it's the Vercel Postgres one (not Prisma-hosted)
3. **Check database status** - In Vercel Storage, ensure database is active
4. **Run migrations manually** - Use the commands above

## What I Changed

I updated two files to support `POSTGRES_URL` as a fallback:

1. **`lib/prisma.ts`** - Maps `POSTGRES_URL` to `DATABASE_URL` if needed
2. **`lib/env.ts`** - Uses `POSTGRES_URL` as fallback for `DATABASE_URL`

This means you can use either:
- `DATABASE_URL` (standard, recommended)
- `POSTGRES_URL` (Vercel provides this, now supported)

Both will work now! 🎉

