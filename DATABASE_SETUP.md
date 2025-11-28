# Database Connection String Guide

## Which Connection String to Use?

You have three connection strings. Here's what each is for:

### 1. `DATABASE_URL` ✅ **USE THIS**
- **Standard PostgreSQL connection**
- Direct connection to your database
- Use this for Prisma migrations and standard operations
- **Set this in Vercel environment variables**

### 2. `POSTGRES_URL`
- Same as `DATABASE_URL` (redundant)
- You can ignore this one
- Some platforms provide both, but Prisma uses `DATABASE_URL`

### 3. `PRISMA_DATABASE_URL` (Optional - Advanced)
- **Prisma Accelerate connection** (connection pooling service)
- Provides connection pooling and caching
- Better performance in serverless environments (Vercel)
- **Optional** - only use if you want enhanced performance
- Requires Prisma Accelerate subscription

## Setup Instructions

### Standard Setup (Recommended)

1. **In Vercel Environment Variables**, add:
   ```
   DATABASE_URL="postgres://37202831c97e7ea0b8b373d32292c7ad7a50fe09b4c7aed58e9e02640d9a36ef:sk_zbhHY_xcxruNok-gkTAjk@db.prisma.io:5432/postgres?sslmode=require"
   ```

2. **Update `prisma/schema.prisma`** (already done):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Create migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Deploy** - Vercel will automatically run migrations during build

### Optional: Prisma Accelerate Setup (For Better Performance)

If you want to use Prisma Accelerate for connection pooling:

1. **Update `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("PRISMA_DATABASE_URL")  // Use Accelerate URL
   }
   ```

2. **In Vercel**, set:
   ```
   PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
   ```

3. **Install Prisma Accelerate**:
   ```bash
   npm install @prisma/extension-accelerate
   ```

4. **Update `lib/prisma.ts`** to use Accelerate extension

**Note**: Prisma Accelerate is a paid service. For most projects, standard `DATABASE_URL` is sufficient.

## Quick Answer

✅ **Use `DATABASE_URL`** - This is the standard connection string that Prisma expects.

⚠️ **IMPORTANT**: If you created PostgreSQL in Vercel, you MUST use the Vercel Postgres connection string, NOT the Prisma-hosted one!

### How to Find Your Vercel Postgres Connection String:

1. Go to Vercel project → **Storage** tab
2. Click on your **Postgres** database
3. Look for **Connection String** or **.env.local** tab
4. Copy that connection string (it will be different from the Prisma one)
5. Use that in your `DATABASE_URL` environment variable

The schema has been updated to use PostgreSQL with `DATABASE_URL`.

## Next Steps

1. Set `DATABASE_URL` in Vercel environment variables
2. Set `JWT_SECRET` in Vercel environment variables
3. Run: `npx prisma migrate dev --name init` (locally first)
4. Push to GitHub
5. Deploy on Vercel

The build process will automatically:
- Generate Prisma Client
- Run migrations (`prisma migrate deploy`)
- Build your Next.js app

