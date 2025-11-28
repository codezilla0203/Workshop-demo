# Fix: Database Connection Error in Vercel

## Problem
You're getting "Database error occurred" because you're using the wrong `DATABASE_URL`.

## Solution: Use Vercel Postgres Connection String

### Step 1: Find Your Vercel Postgres Connection String

1. Go to your **Vercel project dashboard**
2. Click on the **Storage** tab (left sidebar)
3. Click on your **Postgres** database
4. Go to the **.env.local** tab or **Connection String** section
5. Copy the connection string - it should look like:
   ```
   postgres://default:xxxxx@xxxxx.aws.neon.tech:5432/verceldb?sslmode=require
   ```
   OR
   ```
   postgres://verceldb_owner:xxxxx@ep-xxxxx.us-east-1.aws.neon.tech/verceldb?sslmode=require
   ```

### Step 2: Update Environment Variables in Vercel

1. In Vercel project → **Settings** → **Environment Variables**
2. **Delete** the current `DATABASE_URL` (the one with `db.prisma.io`)
3. **Add new** `DATABASE_URL` with your **Vercel Postgres** connection string
4. Make sure it's set for **Production**, **Preview**, and **Development** environments

### Step 3: Run Database Migrations

The database needs to be initialized with your schema. You have two options:

#### Option A: Automatic (During Build)
If your build script includes `prisma migrate deploy`, migrations will run automatically.

#### Option B: Manual (Via Vercel CLI)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

#### Option C: Via Vercel Dashboard Terminal
1. Go to your deployment in Vercel
2. Click on the deployment
3. Open the terminal/console
4. Run: `npx prisma migrate deploy`

### Step 4: Verify Connection

After setting the correct `DATABASE_URL`:
1. Redeploy your application
2. Check the build logs for migration success
3. Test your application

## Important Notes

### Which Connection String to Use?

✅ **USE**: Vercel Postgres connection string (from Vercel Storage)
- Format: `postgres://user:pass@host:5432/dbname?sslmode=require`
- This is the database you created in Vercel

❌ **DON'T USE**: Prisma-hosted database (`db.prisma.io`)
- This is a different database service
- Not connected to your Vercel Postgres

❌ **DON'T USE**: `PRISMA_DATABASE_URL` (unless using Prisma Accelerate)
- This is for connection pooling service
- Requires additional setup

### Environment Variable Format

In Vercel, when adding `DATABASE_URL`:
- **Name**: `DATABASE_URL`
- **Value**: Your Vercel Postgres connection string (the one from Storage tab)
- **Environment**: Select all (Production, Preview, Development)

### Example Vercel Postgres Connection String

```
postgres://default:AbCdEf123456@ep-cool-name-123456.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require
```

## Troubleshooting

### Still Getting Database Errors?

1. **Check build logs** - Look for migration errors
2. **Verify DATABASE_URL** - Make sure it's the Vercel Postgres one
3. **Check database status** - In Vercel Storage, ensure database is active
4. **Run migrations manually** - Use Option B or C above

### Migration Errors?

If you see "relation does not exist" or similar:
- The database is empty - you need to run migrations
- Run: `npx prisma migrate deploy` (via CLI or dashboard terminal)

### Connection Timeout?

- Check if database is paused (free tier databases pause after inactivity)
- Wake it up in Vercel Storage dashboard
- Or use a connection pooler

## Quick Checklist

- [ ] Found Vercel Postgres connection string in Storage tab
- [ ] Updated `DATABASE_URL` in Vercel environment variables
- [ ] Removed old Prisma-hosted `DATABASE_URL`
- [ ] Set `JWT_SECRET` environment variable
- [ ] Ran database migrations (`prisma migrate deploy`)
- [ ] Redeployed application
- [ ] Tested the application

